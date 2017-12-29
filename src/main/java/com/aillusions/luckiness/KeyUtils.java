package com.aillusions.luckiness;

import org.bitcoinj.core.*;
import org.bitcoinj.params.MainNetParams;
import org.spongycastle.util.BigIntegers;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * @author aillusions
 */
public class KeyUtils {

    public static final BigInteger MIN_BTC_KEY = new BigInteger("1");
    public static final BigInteger MAX_BTC_KEY = new BigInteger("115792089237316195423570985008687907852837564279074904382605163141518161494337");
    public static final Set<String> LOGGED_KEYS = Collections.synchronizedSet(new HashSet<>());
    public static final BigInteger CHECK_RANGE = BigInteger.valueOf(500L);

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
        return getNewECKey(new BigInteger(hex, 16));
    }

    public static ECKey getKeyFromWIFBase58(String base58) {
        DumpedPrivateKey dumpedKey = DumpedPrivateKey.fromBase58(MainNetParams.get(), base58);
        return dumpedKey.getKey();
    }

    public static String keyToWif(ECKey key) {
        return key.getPrivateKeyAsWiF(MainNetParams.get());
    }

    public static boolean checkKeyFor(BigInteger thisVal, DormantBloomFilter bloomFilter) {

        ECKey key = getNewECKey(thisVal);
        String testBtcAddress = getBtcAddress(key);

        if (bloomFilter.has(testBtcAddress)) {
            String thisValDec = thisVal.toString(10);
            if (!KnownKeysProvider.getKnownKeys().contains(thisValDec)) {
                logFound(key, thisValDec);
            }
            return true;
        }
        return false;
    }

    public static void logFound(ECKey key, String decimalKey) {

        if (LOGGED_KEYS.contains(decimalKey)) {
            return;
        }

        String privateKeyAsHex = key.getPrivateKeyAsHex();
        String publicKeyAsHex = key.getPublicKeyAsHex();
        String testBtcAddress = getBtcAddress(key);

        System.out.println(
                "\n\n----------------------\n\n" +
                        " Found private key:\n" +
                        "  dec: " + decimalKey + "\n" +
                        "  wif: " + keyToWif(key) + "\n" +
                        "  pub: " + testBtcAddress);

        LOGGED_KEYS.add(decimalKey);
    }

    private static final SecureRandom secureRandom = new SecureRandom();

    public static BigInteger getRandom(BigInteger min) {
        BigInteger max = new BigInteger("115792089237316195423570985008687907852837564279074904382605163141518161494337");
        return BigIntegers.createRandomInRange(min, max, secureRandom);
    }
}
