package com.aillusions.ckeckiness;

import com.aillusions.luckiness.KeyUtils;
import com.google.common.hash.BloomFilter;
import junit.framework.TestCase;
import org.bitcoinj.core.ECKey;

import java.io.IOException;
import java.math.BigInteger;

public class TestSpeed extends TestCase {

    private static final long ONE_SEC = 1000L;

    // Around 222,337,122 on PC
    // Around 31,119,811 on mac
    public void testIterationsPesSec() {
        long start = System.currentTimeMillis();

        int iterations = 0;
        while ((System.currentTimeMillis() - start) < ONE_SEC) {
            iterations++;
        }

        System.out.println("Iterations: " + iterations);
    }

    // Around 36,742,954 on PC
    // Around 17,614,998 on mac
    public void testBigIntegersPerSec() {
        long start = System.currentTimeMillis();

        BigInteger thisVal = new BigInteger("0");

        int iterations = 0;
        while ((System.currentTimeMillis() - start) < ONE_SEC) {
            iterations++;
            thisVal = thisVal.add(BigInteger.ONE);
        }

        System.out.println("Iterations: " + iterations);
    }

    // Around 36,833 on PC
    // Around 48,656 on mac
    public void testECKeysPerSec() {
        long start = System.currentTimeMillis();

        int iterations = 0;
        while ((System.currentTimeMillis() - start) < ONE_SEC) {
            iterations++;
            ECKey key = KeyUtils.getNewECKey(iterations + "");
            //  ECKey key = new CustomECKey(new BigInteger(iterations + ""));
        }

        System.out.println("Iterations: " + iterations);
    }

    // Around 2,034,260 on PC
    // Around 1,054,226 on mac
    public void testBloomChecksPerSec() throws IOException {

        BloomFilter filter = DormantBloomFilter.getBigBloomFilter();

        long start = System.currentTimeMillis();

        int iterations = 0;
        while ((System.currentTimeMillis()) - start < ONE_SEC) {
            iterations++;
            filter.mightContain(iterations + "");
        }

        System.out.println("Iterations: " + iterations + " for filter with: " + filter.approximateElementCount() + " elements.");
    }
}
