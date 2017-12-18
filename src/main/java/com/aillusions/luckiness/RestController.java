package com.aillusions.luckiness;

import lombok.Setter;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.params.MainNetParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

/**
 * @author aillusions
 */
@org.springframework.web.bind.annotation.RestController()
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/rest/v1/lucky")
@Setter
public class RestController {

    private static final BigInteger CHECK_RANGE = BigInteger.valueOf(6L);

    private DormantBloomFilter bloomFilter;

    {
        DormantAddressProvider prov = new DormantAddressProvider();
        bloomFilter = new DormantBloomFilter(prov.getDormantAddresses());
    }

    @Autowired
    private AsyncService asyncService;

    // http://localhost:8080/rest/v1/lucky/about
    @RequestMapping(value = "/about", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AboutDto about() throws InterruptedException {
        return new AboutDto();
    }

    // http://localhost:8080/rest/v1/lucky/check/245364787645342312142536754
    @RequestMapping(value = "/check/{providedKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public CheckKeyResultDto check(@PathVariable String providedKey) throws InterruptedException {

        long start = System.currentTimeMillis();

        //ECKey key = getNewECKey(providedKey);
        //String testBtcAddress = getBtcAddress(key);

        // String privateKeyAsHex = key.getPrivateKeyAsHex();
        // String publicKeyAsHex = key.getPublicKeyAsHex();

        try {
            return new CheckKeyResultDto(checkBatchFor(providedKey));
        } finally {
            System.out.println("checked in " + (System.currentTimeMillis() - start) + " ms: " + providedKey);
        }
    }

    public boolean checkBatchFor(String providedKey) {
        BigInteger origKey = new BigInteger(providedKey);

        BigInteger from = origKey.subtract(CHECK_RANGE);
        BigInteger to = origKey.add(CHECK_RANGE);

        BigInteger thisVal = from;

        do {

            ECKey key = getNewECKey(thisVal);
            String testBtcAddress = getBtcAddress(key);

            //System.out.println("Checking: " + thisVal);

            if (bloomFilter.has(testBtcAddress)) {

                String privateKeyAsHex = key.getPrivateKeyAsHex();
                String publicKeyAsHex = key.getPublicKeyAsHex();

                System.out.println(
                        " Found private key:\n" +
                                "      " + key.getPrivateKeyAsHex() + "\n" +
                                " And public key:\n" +
                                "      " + key.getPublicKeyAsHex());

                return true;
            }

            thisVal = thisVal.add(BigInteger.ONE);

        } while (thisVal.compareTo(to) <= 0);

        return false;
    }

    public static ECKey getNewECKey(String providedKeyValue) {
        return ECKey.fromPrivate(new BigInteger(providedKeyValue));
    }

    public static ECKey getNewECKey(BigInteger key) {
        return ECKey.fromPrivate(key);
    }

    public static String getBtcAddress(ECKey key) {

        final NetworkParameters netParams = MainNetParams.get();
        Address addressFromKey = key.toAddress(netParams);

        return addressFromKey.toBase58();
    }
}
