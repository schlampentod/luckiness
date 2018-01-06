package com.aillusions.luckiness;

import java.math.BigInteger;
import java.util.concurrent.LinkedBlockingQueue;

import static org.apache.commons.lang3.ObjectUtils.median;

/**
 * @author aillusions
 */
public class BatchKeyCheckRanger {

    private static final BigInteger MIN_FOR_BATCH = new BigInteger("1000000000000000000000000000000000000000000000000000000000000000000000000000");

    private static final BigInteger MIN_RANGE_VAL = BigInteger.valueOf(2);

    private static BigInteger CHECK_RANGE = BigInteger.valueOf(100L);
    private static BigInteger CHECK_INCR = BigInteger.valueOf(10L);

    private static final int CAP = 10;

    private static final LinkedBlockingQueue<Long> responseTimes = new LinkedBlockingQueue<>(CAP);

    public static synchronized void adjustRangeByResponseTime(long responseTime, BigInteger rangeChecked) {

        //System.out.println("checked in " + responseTime + " ms.");

        if (rangeChecked.equals(MIN_RANGE_VAL)) {
            return;
        }

        if (responseTimes.size() >= CAP) {
            responseTimes.poll();
        }

        responseTimes.add(responseTime);

        if (responseTimes.size() < CAP) {
            return;
        }

        Long[] responseTimesArr = responseTimes.toArray(new Long[responseTimes.size()]);
        double myMedian = median(responseTimesArr);
        // System.out.println("myMedian: " + myMedian);

        if (myMedian > 30) {
            BigInteger newVal = CHECK_RANGE.subtract(CHECK_INCR);

            if (newVal.compareTo(MIN_RANGE_VAL) > 0) {
                CHECK_RANGE = newVal;
            } else {
                CHECK_RANGE = MIN_RANGE_VAL;
            }

            responseTimes.clear();
            System.out.println("adjustRange ↓ " + CHECK_RANGE + " ");
        } else if (myMedian < 20) {
            CHECK_RANGE = CHECK_RANGE.add(CHECK_INCR);
            System.out.println("adjustRange   " + CHECK_RANGE + " ↑");
            responseTimes.clear();
        }
    }

    public static synchronized BigInteger getRange(BigInteger origKey) {
        if (origKey == null) {
            origKey = new BigInteger("1");
        }

        if (MIN_FOR_BATCH.compareTo(origKey) > 0) {
            return MIN_RANGE_VAL;
        }

        return CHECK_RANGE;
    }
}
