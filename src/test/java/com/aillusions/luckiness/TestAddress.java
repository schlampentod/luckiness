package com.aillusions.luckiness;

import junit.framework.TestCase;
import org.bitcoinj.core.ECKey;

import java.math.BigInteger;

/**
 * @author aillusions
 */
public class TestAddress extends TestCase {
    public void testAddress() {

        BigInteger bigInt = new BigInteger("01f272ad2d099521ce2e653d1398c1016bf0e01c81809b94f2c1227ed273cb1a", 16);
        ECKey key = RestController.getNewECKey(bigInt);

        System.out.println(RestController.getBtcAddress(key));

    }
}
