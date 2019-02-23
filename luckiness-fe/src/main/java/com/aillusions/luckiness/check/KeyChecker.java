package com.aillusions.luckiness.check;

import com.aillusions.luckiness.CheckBatchResponse;
import com.aillusions.luckiness.KeyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;

/**
 * @author aillusions
 */
@Service
public class KeyChecker {

    @Autowired
    private DormantAddressBloomFilter bloomFilter;

    public CheckBatchResponse checkKey(String providedKey) {

        CheckBatchResponse rv = new CheckBatchResponse();
        BigInteger origKey = new BigInteger(providedKey);

        if (origKey.compareTo(KeyUtils.MIN_BTC_KEY) < 0 || origKey.compareTo(KeyUtils.MAX_BTC_KEY) > 0) {
            return rv;
        }

        if (KeyUtils.checkKeyFor(origKey, bloomFilter)) {
            String origKeyDec = origKey.toString(10);
            rv.getFoundKeys().add(origKeyDec);
        }

        return rv;
    }
}
