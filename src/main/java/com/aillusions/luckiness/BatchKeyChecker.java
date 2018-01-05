package com.aillusions.luckiness;

import java.math.BigInteger;

/**
 * @author aillusions
 */
public class BatchKeyChecker {

    private final BigInteger MIN_FOR_BATCH = new BigInteger("1213128791129614446453130083644468313573376457679529860692137325810570686867");
    private final DormantBloomFilter bloomFilter;

    public BatchKeyChecker() {
        bloomFilter = new DormantBloomFilter(new DormantAddressProvider().getDormantAddresses());
    }

    public CheckBatchResponse checkBatchFor(String providedKey) {

        CheckBatchResponse rv = new CheckBatchResponse();

        BigInteger origKey = new BigInteger(providedKey);

        BigInteger from;
        BigInteger to;

        if (MIN_FOR_BATCH.compareTo(origKey) > 0) {
            from = origKey.subtract(BigInteger.valueOf(2));
            to = origKey.add(BigInteger.valueOf(2));
        } else {
            from = origKey.subtract(KeyUtils.CHECK_RANGE);
            to = origKey.add(KeyUtils.CHECK_RANGE);
        }

        BigInteger thisVal = from;

        do {

            if (thisVal.compareTo(KeyUtils.MIN_BTC_KEY) < 0 || thisVal.compareTo(KeyUtils.MAX_BTC_KEY) > 0) {
                thisVal = thisVal.add(BigInteger.ONE);
                continue;
            }

            if (KeyUtils.checkKeyFor(thisVal, bloomFilter)) {
                String thisValDec = thisVal.toString(10);
                rv.getFoundKeys().add(thisValDec);
            }

            thisVal = thisVal.add(BigInteger.ONE);

        } while (thisVal.compareTo(to) <= 0);

        return rv;
    }
}
