package com.aillusions.luckiness;

import java.math.BigInteger;

/**
 * @author aillusions
 */
public class BatchKeyCheckRanger {

    private static final BigInteger MIN_FOR_BATCH = new BigInteger("1213128791129614446453130083644468313573376457679529860692137325810570686867");

    public static final BigInteger CHECK_RANGE = BigInteger.valueOf(400L);

    public static BigInteger getRange(BigInteger origKey) {
        if (MIN_FOR_BATCH.compareTo(origKey) > 0) {
            return BigInteger.valueOf(2);
        }

        return CHECK_RANGE;
    }
}
