package com.aillusions.luckiness.web;

import com.aillusions.luckiness.AsyncService;
import com.aillusions.luckiness.DormantAddressProvider;
import com.aillusions.luckiness.DormantBloomFilter;
import lombok.Setter;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.bitcoinj.core.*;
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

    private static final BigInteger MIN_BTC_KEY = new BigInteger("1");
    private static final BigInteger MAX_BTC_KEY = new BigInteger("115792089237316195423570985008687907852837564279074904382605163141518161494337");

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

        try {
            validateKeyValue(providedKey);
            return new CheckKeyResultDto(checkBatchFor(providedKey));
        } catch (Exception e) {
            System.out.println("Unable to check key: " + ExceptionUtils.getMessage(e));
            return new CheckKeyResultDto(false);
        } finally {
            // System.out.println("checked in " + (System.currentTimeMillis() - start) + " ms: " + providedKey);
        }
    }

    // http://localhost:8080/rest/v1/lucky/resolve/85373582762808404920801888792437094602169475096082456154754419692323304989563
    @RequestMapping(value = "/resolve/{providedKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AddressesResultDto resolve(@PathVariable String providedKey) throws InterruptedException {

        long start = System.currentTimeMillis();

        try {
            ECKey key = getNewECKey(providedKey);
            String testBtcAddress = getBtcAddress(key);

            String privateKeyAsHex = key.getPrivateKeyAsHex();
            String publicKeyAsHex = key.getPublicKeyAsHex();

            System.out.println(providedKey + " -> " + testBtcAddress + " in " + (System.currentTimeMillis() - start) + " ms: ");

            return new AddressesResultDto(privateKeyAsHex, publicKeyAsHex, RestController.keyToWif(key), testBtcAddress);
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
        rv.getKnownKeyDtos().add(new KnownKeyDto("1"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("2"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("3"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("4"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("5"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("6"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("7"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("8"));
        // rv.getKnownKeyDtos().add(new KnownKeyDto("9"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("10"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("11"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("12"));
        //rv.getKnownKeyDtos().add(new KnownKeyDto("13"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("14"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("15"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("16"));
        //rv.getKnownKeyDtos().add(new KnownKeyDto("17"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("18"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("19"));
        //rv.getKnownKeyDtos().add(new KnownKeyDto("20"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("21"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("22"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("23"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("24"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("25"));
        rv.getKnownKeyDtos().add(new KnownKeyDto("48635463943209834798109814161294753926839975257569795305637098542720658922315")); // 5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw > 12AKRNHpFhDSBDD9rSn74VAzZSL3774PxQ
        rv.getKnownKeyDtos().add(new KnownKeyDto("85373582762808404920801888792437094602169475096082456154754419692323304989563")); // 5KFQvLvrmhFEcMpYWLCjALW7UR7EPz8tyWuP56qmhu4GnVeNCGq > 12NEsPS2tPhjXJHd3kGkTvQ7ECGypuxbeo
        return rv;
    }

    // http://localhost:8080/rest/v1/lucky/convert/base68/5KFQvLvrmhFEcMpYWLCjALW7UR7EPz8tyWuP56qmhu4GnVeNCGq
    @RequestMapping(value = "/convert/base68/{providedBase58Key}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ConvertedKeyDto convertWIF(@PathVariable String providedBase58Key) {
        return new ConvertedKeyDto(getKeyFromWIFBase58(providedBase58Key).getPrivKey().toString(10));
    }

    // http://localhost:8080/rest/v1/lucky/convert/hex/6B86B273FF34FCE19D6B804EFF5A3F5747ADA4EAA22F1D49C01E52DDB7875B4B
    @RequestMapping(value = "/convert/hex/{providedHexKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ConvertedKeyDto convertHex(@PathVariable String providedHexKey) {
        return new ConvertedKeyDto(getKeyFromHex(providedHexKey).getPrivKey().toString(10));
    }

    public boolean checkBatchFor(String providedKey) {
        BigInteger origKey = new BigInteger(providedKey);

        BigInteger from = origKey.subtract(CHECK_RANGE);
        if (from.compareTo(BigInteger.ZERO) < 0) {
            from = origKey;
        }

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
                        " Found private key hex:\n" +
                                "      " + key.getPrivateKeyAsHex() + "\n" +
                                " And public address:\n" +
                                "      " + testBtcAddress +
                                " And public key :\n" +
                                "      " + key.getPublicKeyAsHex());

                return true;
            }

            thisVal = thisVal.add(BigInteger.ONE);

        } while (thisVal.compareTo(to) <= 0);

        return false;
    }

    public static ECKey getNewECKey(String providedKeyValue) {
        return new CustomECKey(validateKeyValue(providedKeyValue));
    }

    public static ECKey getNewECKey(BigInteger key) {
        return new CustomECKey(validateKeyValue(key));
    }

    public static BigInteger validateKeyValue(String providedKeyValue) {
        return validateKeyValue(new BigInteger(providedKeyValue));
    }

    public static BigInteger validateKeyValue(BigInteger providedKeyValue) {
        if (providedKeyValue.compareTo(MIN_BTC_KEY) < 0) {
            throw new RuntimeException("Key assertion failure (too small): " + providedKeyValue.toString(10));
        }

        if (providedKeyValue.compareTo(MAX_BTC_KEY) > 0) {
            BigInteger diff = providedKeyValue.subtract(MAX_BTC_KEY);

            throw new RuntimeException("Key assertion failure (too big): "
                    + "\n" + providedKeyValue.toString(10)
                    + "\n" + MAX_BTC_KEY.toString(10)
                    + "\n"
                    + diff.toString(10)
                    + "\n");
        }

        return providedKeyValue;
    }

    public static String getBtcAddress(ECKey key) {

        final NetworkParameters netParams = MainNetParams.get();
        Address addressFromKey = key.toAddress(netParams);

        return addressFromKey.toBase58();
    }

    public static ECKey getKeyFromHex(String hex) {
        return RestController.getNewECKey(new BigInteger(hex, 16));
    }

    public static ECKey getKeyFromWIFBase58(String base58) {
        DumpedPrivateKey dumpedKey = DumpedPrivateKey.fromBase58(MainNetParams.get(), base58);
        return dumpedKey.getKey();
    }

    public static String keyToWif(ECKey key) {
        return key.getPrivateKeyAsWiF(MainNetParams.get());
    }


    /*


    http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf








http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreCMUnXUo
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreCUtzTQw
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreCXbRta3
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreCh1de82
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreCpWSv5Y
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreCw2uZTA
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreD437Nay
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreDAgeFqw
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreDEUj22G
http://localhost:8080/rest/v1/lucky/convert/base68/5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreDQbAmx9



    */
}
