package com.aillusions.luckiness;

import junit.framework.TestCase;

import java.math.BigInteger;

/**
 * @author aillusions
 */
public class BatchKeyCheckRangerTest extends TestCase {

    public void testBatcher() {

        for (int i = 0; i < 200; i++) {
            BatchKeyCheckRanger.adjustRangeByResponseTime(i, BigInteger.valueOf(10));
        }

        BatchKeyCheckRanger.getRange(null);
    }
}
