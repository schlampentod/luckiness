package com.aillusions.luckiness.standalone;

import com.aillusions.luckiness.check.AllAddressesBloomFilter;
import com.aillusions.luckiness.KeyUtils;
import com.aillusions.luckiness.check.PkBloomFilter;

import java.io.PrintWriter;
import java.math.BigInteger;

/**
 * @author aillusions
 */
public class PrivKeyFinderWorker implements Runnable {

    BigInteger startingFrom = new BigInteger("11011301348490244036190665606861610068404650509358250335960553511767605706649");
    long range = 1000;

    private final PrintWriter writer;
    private final PkBloomFilter bloomFilter;
    private long localCounter = 0L;

    PrivKeyFinderWorker(PrintWriter writer, PkBloomFilter bloomFilter) {
        this.writer = writer;
        this.bloomFilter = bloomFilter;
    }

    @Override
    public void run() {

        BigInteger bigKey = getRandomInRange();

        while (true) {

            //long globalCntr = Main.GLOBAL_COUNTER.incrementAndGet();
            //if ((globalCntr % 10_000_000) == 0) {
            //    System.out.println("Handled: " + globalCntr / 1_000_000L + " M keys");
            //}

            localCounter++;

            if (localCounter > 10) {
                bigKey = getRandomInRange();
                localCounter = 0;
                //System.out.println("Searching around: " + bigKey.toString(10));
            }

            bigKey = bigKey.add(BigInteger.valueOf(localCounter));

            boolean found = KeyUtils.checkKeyFor(bigKey, bloomFilter);

            if (found) {
                writer.append("found: " + bigKey.toString(10));
                writer.flush();
                System.out.println("found: " + bigKey.toString(10));
                System.exit(0);
            }
        }

        // System.out.println("Worker done.");
    }

    private BigInteger getRandomInRange() {
        BigInteger rv = KeyUtils.getRandom(startingFrom);
        rv = rv.subtract(BigInteger.valueOf(range / 5));
        return rv;
    }

}
