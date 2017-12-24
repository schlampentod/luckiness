package com.aillusions.luckiness.web;

import com.aillusions.luckiness.AsyncService;
import com.aillusions.luckiness.KeyUtils;
import com.aillusions.luckiness.KnownKeysProvider;
import lombok.Setter;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.bitcoinj.core.ECKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.Collections;
import java.util.Comparator;

/**
 * @author aillusions
 */
@org.springframework.web.bind.annotation.RestController()
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/rest/v1/lucky")
@Setter
public class RestController {

    @Autowired
    private AsyncService asyncService;

    // http://localhost:8080/rest/v1/lucky/about
    @RequestMapping(value = "/about", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AboutDto about() throws InterruptedException {
        return new AboutDto();
    }

    // http://localhost:8080/rest/v1/lucky/check/batch/245364787645342312142536754
    @RequestMapping(value = "/check/batch/{providedKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public CheckKeyResultDto check(@PathVariable String providedKey) throws InterruptedException {

        long start = System.currentTimeMillis();

        try {

            KeyUtils.validateKeyValue(providedKey);
            CheckBatchResponse checkBatchResponse = KeyUtils.checkBatchFor(providedKey);
            return new CheckKeyResultDto(!checkBatchResponse.getFoundKeys().isEmpty(), checkBatchResponse.getFoundKeys());

        } catch (Exception e) {
            System.out.println("Unable to check key: " + ExceptionUtils.getMessage(e));
            return new CheckKeyResultDto(false, Collections.EMPTY_SET);
        } finally {
            System.out.println("checked in " + (System.currentTimeMillis() - start) + " ms: " + providedKey);
        }
    }

    // http://localhost:8080/rest/v1/lucky/resolve/85373582762808404920801888792437094602169475096082456154754419692323304989563
    @RequestMapping(value = "/resolve/{providedKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AddressesResultDto resolve(@PathVariable String providedKey) throws InterruptedException {

        long start = System.currentTimeMillis();

        try {
            ECKey key = KeyUtils.getNewECKey(providedKey);
            String testBtcAddress = KeyUtils.getBtcAddress(key);

            String privateKeyAsHex = key.getPrivateKeyAsHex();
            String publicKeyAsHex = key.getPublicKeyAsHex();

            // System.out.println(providedKey + " -> " + testBtcAddress + " in " + (System.currentTimeMillis() - start) + " ms: ");

            return new AddressesResultDto(privateKeyAsHex, publicKeyAsHex, KeyUtils.keyToWif(key), testBtcAddress);
        } catch (Exception e) {
            System.out.println("Unable to resolve key: " + ExceptionUtils.getMessage(e));
            return new AddressesResultDto();
        }
    }

    // TODO https://lbc.cryptoguru.org/trophies
    // TODO https://www.blockshack.com/
    // http://localhost:8080/rest/v1/lucky/known
    @RequestMapping(value = "/known", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public KnownKeysDto known() {

        KnownKeysDto rv = new KnownKeysDto();

        for (String s : KnownKeysProvider.getKnownKeys()) {
            rv.getKnownKeyDtos().add(new KnownKeyDto(s));
        }

        Collections.sort(rv.getKnownKeyDtos(), new Comparator<KnownKeyDto>() {
            @Override
            public int compare(KnownKeyDto o1, KnownKeyDto o2) {
                return new BigInteger(o1.getKnownKeyDecimal()).compareTo(new BigInteger(o2.getKnownKeyDecimal()));
            }
        });

        return rv;
    }

    // http://localhost:8080/rest/v1/lucky/convert/base68/5KFQvLvrmhFEcMpYWLCjALW7UR7EPz8tyWuP56qmhu4GnVeNCGq
    @RequestMapping(value = "/convert/base68/{providedBase58Key}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ConvertedKeyDto convertWIF(@PathVariable String providedBase58Key) {
        return new ConvertedKeyDto(KeyUtils.getKeyFromWIFBase58(providedBase58Key).getPrivKey().toString(10));
    }

    // http://localhost:8080/rest/v1/lucky/convert/hex/6B86B273FF34FCE19D6B804EFF5A3F5747ADA4EAA22F1D49C01E52DDB7875B4B
    @RequestMapping(value = "/convert/hex/{providedHexKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ConvertedKeyDto convertHex(@PathVariable String providedHexKey) {
        return new ConvertedKeyDto(KeyUtils.getKeyFromHex(providedHexKey).getPrivKey().toString(10));
    }
}
