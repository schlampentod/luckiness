package trn;

import com.aillusions.ckeckiness.DormantBloomFilter;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.params.MainNetParams;

import java.io.PrintWriter;
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

    private final PrintWriter writer;
    private final AtomicLong counter;
    private final DormantBloomFilter bloomFilter;

    @Override
    public void run() {

        ECKey key;
        String testBtcAddr;

        logInfo("Started..");

        do {
            key = getNewECKey();
            testBtcAddr = getBtcAddress(key);
            counter.incrementAndGet();
        } while (!bloomFilter.has(testBtcAddr));

        logInfo("" +
                " Address found:  \n" +
                "      " + testBtcAddr);

        System.out.print("\007");
        System.out.flush();

        logInfo("" +
                " For private key:\n" +
                "      " + key.getPrivateKeyAsHex() + "\n" +
                " And public key:\n" +
                "      " + key.getPublicKeyAsHex());
    }

    private void logInfo(String info) {

        synchronized (PrivKeyFinderWorker.class) {
            writer.append(info + "\n");
            System.out.println(info);
            //writer.close();
            writer.flush();
        }

    }

    public static ECKey getNewECKey() {
        return new ECKey();
    }

    public static String getBtcAddress(ECKey key) {

        final NetworkParameters netParams = MainNetParams.get();
        Address addressFromKey = key.toAddress(netParams);

        return addressFromKey.toBase58();
    }

}
