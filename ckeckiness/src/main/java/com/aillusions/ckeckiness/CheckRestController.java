package com.aillusions.ckeckiness;

import com.aillusions.luckiness.KeyUtils;
import com.aillusions.luckiness.KnownKeysProvider;
import com.aillusions.luckiness.web.CheckBatchResponse;
import com.aillusions.luckiness.web.CheckKeyResultDto;
import lombok.Setter;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.bitcoinj.core.ECKey;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * @author aillusions
 */
@RestController()
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/rest/v1/checky")
@Setter
public class CheckRestController {

    public static final Set<String> LOGGED_KEYS = Collections.synchronizedSet(new HashSet<>());

    private static final BigInteger CHECK_RANGE = BigInteger.valueOf(500L);

    private static DormantBloomFilter bloomFilter;

    static {
        bloomFilter = new DormantBloomFilter(new DormantAddressProvider().getDormantAddresses());
    }

    // http://localhost:8081/rest/v1/checky/check/batch/245364787645342312142536754
    @RequestMapping(value = "/check/batch/{providedKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public CheckKeyResultDto check(@PathVariable String providedKey) throws InterruptedException {

        long start = System.currentTimeMillis();

        try {

            KeyUtils.validateKeyValue(providedKey);
            CheckBatchResponse checkBatchResponse = checkBatchFor(providedKey);
            return new CheckKeyResultDto(!checkBatchResponse.getFoundKeys().isEmpty(), checkBatchResponse.getFoundKeys());

        } catch (Exception e) {
            System.out.println("Unable to check key: " + ExceptionUtils.getMessage(e));
            return new CheckKeyResultDto(false, Collections.EMPTY_SET);
        } finally {
            //  System.out.println("checked in " + (System.currentTimeMillis() - start) + " ms: " + providedKey);
        }
    }

    public static CheckBatchResponse checkBatchFor(String providedKey) {

        CheckBatchResponse rv = new CheckBatchResponse();

        BigInteger origKey = new BigInteger(providedKey);

        BigInteger from = origKey.subtract(CHECK_RANGE);
        BigInteger to = origKey.add(CHECK_RANGE);

        BigInteger thisVal = from;

        do {

            if (thisVal.compareTo(KeyUtils.MIN_BTC_KEY) < 0 || thisVal.compareTo(KeyUtils.MAX_BTC_KEY) > 0) {
                thisVal = thisVal.add(BigInteger.ONE);
                continue;
            }

            String thisValDec = thisVal.toString(10);
            ECKey key = KeyUtils.getNewECKey(thisVal);
            String testBtcAddress = KeyUtils.getBtcAddress(key);

            if (bloomFilter.has(testBtcAddress)) {
                if (!KnownKeysProvider.getKnownKeys().contains(thisValDec)) {
                    logFound(key, thisValDec);
                }
                rv.getFoundKeys().add(thisValDec);
            }

            thisVal = thisVal.add(BigInteger.ONE);

        } while (thisVal.compareTo(to) <= 0);

        return rv;
    }

    private static void logFound(ECKey key, String decimalKey) {

        if (LOGGED_KEYS.contains(decimalKey)) {
            return;
        }

        String privateKeyAsHex = key.getPrivateKeyAsHex();
        String publicKeyAsHex = key.getPublicKeyAsHex();
        String testBtcAddress = KeyUtils.getBtcAddress(key);

        System.out.println(
                "\n\n----------------------\n\n" +
                        " Found private key:\n" +
                        "  dec: " + decimalKey + "\n" +
                        "  wif: " + KeyUtils.keyToWif(key) + "\n" +
                        "  pub: " + testBtcAddress);

        LOGGED_KEYS.add(decimalKey);
    }
}
