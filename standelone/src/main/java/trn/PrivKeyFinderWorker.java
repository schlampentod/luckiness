package trn;

import com.aillusions.ckeckiness.CheckRestController;
import com.aillusions.ckeckiness.DormantBloomFilter;

import java.io.PrintWriter;
import java.math.BigInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * @author aillusions
 */
public class PrivKeyFinderWorker implements Runnable {

    PrivKeyFinderWorker(PrintWriter writer, AtomicLong counter, DormantBloomFilter bloomFilter) {
        this.writer = writer;
        this.counter = counter;
        this.bloomFilter = bloomFilter;
    }

    private static final String start_key = "26620332071894918181543005365761258030749426457641997779997397538985897748055";
    private final PrintWriter writer;
    private final AtomicLong counter;
    private final DormantBloomFilter bloomFilter;

    @Override
    public void run() {

        BigInteger bigKey = new BigInteger(start_key);

        while (true) {

            long i = counter.incrementAndGet();

            BigInteger keyToCheck = bigKey.add(BigInteger.valueOf(i));
            boolean found = CheckRestController.checkKeyFor(keyToCheck, bloomFilter);
            if (found) {
                writer.append("found: " + keyToCheck.toString(10));
                writer.flush();
                System.out.println("found: " + keyToCheck.toString(10));
            }
        }

        //System.out.println("Worker done.");
    }

}
