package com.aillusions.luckiness.standalone;

import com.aillusions.luckiness.check.DormantAddressBloomFilter;
import lombok.extern.slf4j.Slf4j;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Base58Check - bitcoin address format
 *
 * @author aillusions
 */
@Slf4j
public class Main {

    //public static final AtomicLong GLOBAL_COUNTER = new AtomicLong();

    public static void main(String[] args) throws IOException {

        long start = System.currentTimeMillis();

        PrintWriter writer = new PrintWriter(new FileWriter("theirner.log", true));
        DormantAddressBloomFilter bloomFilter = new DormantAddressBloomFilter();

        for (int i = 0; i < 8; i++) {
            Thread thread = new Thread(new PrivKeyFinderWorker(writer, bloomFilter));
            thread.start();
        }

        //Timer timer = new Timer();
        //TimerTask minutelyTask = new TimerTask() {
        //    @Override
        //    public void run() {
        //        //writer.append("Processed: " + GLOBAL_COUNTER.get() + "\n");
        //        System.out.println("Processed: " + GLOBAL_COUNTER.get() + " in " + (System.currentTimeMillis() - start) / (1000 * 60) + " min");
        //        writer.flush();
        //    }
        //};
//
        //timer.schedule(minutelyTask, 0l, 1000 * 60);
    }
}
