package com.aillusions.luckiness.check;

import com.aillusions.luckiness.BatchKeyCheckRanger;
import com.aillusions.luckiness.CheckBatchResponse;
import com.aillusions.luckiness.KeyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;

/**
 * @author aillusions
 */
@Service
public class BatchKeyChecker {

    @Autowired
    private final DormantAddressBloomFilter bloomFilter;

    public BatchKeyChecker() {
        bloomFilter = new DormantAddressBloomFilter();
    }

    public CheckBatchResponse checkBatchFor(String providedKey) {

        CheckBatchResponse rv = new CheckBatchResponse();

        BigInteger origKey = new BigInteger(providedKey);

        BigInteger range = BatchKeyCheckRanger.getRange(origKey);

        rv.setCheckRange(range);

        BigInteger from = origKey.subtract(range);
        BigInteger to = origKey.add(range);

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
