package com.aillusions.ckeckiness;

import com.aillusions.luckiness.KeyUtils;
import junit.framework.TestCase;
import org.bitcoinj.core.CustomECKey;
import org.bitcoinj.core.ECKey;

import java.math.BigInteger;

public class TestSpeed extends TestCase {

    private static final long ONE_SEC = 1000L;

    // Around 222,337,122
    public void testIterationsPesSec() {
        long start = System.currentTimeMillis();

        int iterations = 0;
        while ((System.currentTimeMillis() - start < ONE_SEC)) {
            iterations++;
        }

        System.out.println("Iterations: " + iterations);
    }

    // Around 36,742,954
    public void testBigIntegersPerSec() {
        long start = System.currentTimeMillis();

        BigInteger thisVal = new BigInteger("0");

        int iterations = 0;
        while ((System.currentTimeMillis() - start < ONE_SEC)) {
            iterations++;
            thisVal = thisVal.add(BigInteger.ONE);
        }

        System.out.println("Iterations: " + iterations);
    }

    // Around 36,833
    public void testECKeysPerSec() {
        long start = System.currentTimeMillis();

        int iterations = 0;
        while ((System.currentTimeMillis() - start < ONE_SEC)) {
            iterations++;
            ECKey key = KeyUtils.getNewECKey(iterations + "");
            //  ECKey key = new CustomECKey(new BigInteger(iterations + ""));
        }

        System.out.println("Iterations: " + iterations);
    }
}
