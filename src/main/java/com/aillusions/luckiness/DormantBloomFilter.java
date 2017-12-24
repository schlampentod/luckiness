package com.aillusions.luckiness;

import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

/**
 * @author aillusions
 */
public class DormantBloomFilter {

    public static final String UTF_8 = "UTF-8";

    private BloomFilter filter;

    public DormantBloomFilter(List<String> listOfLines) {

        long start = System.currentTimeMillis();

        try {
            filter = BloomFilter.readFrom(new FileInputStream("g:\\csv_dump\\addr_all.bin"),
                    Funnels.stringFunnel(Charset.forName("UTF-8")));
        } catch (IOException e) {

            e.printStackTrace();

            filter = BloomFilter.create(
                    Funnels.stringFunnel(Charset.forName(UTF_8)),
                    listOfLines.size(),
                    0.00000000000000001/*1F / listOfLines.size()*/);

            for (String address : listOfLines) {
                filter.put(address);
            }
        }

        System.out.println("DormantBloomFilter initialized in: " + (System.currentTimeMillis() - start) + "ms.");
    }

    public boolean has(String addr) {
        return filter.mightContain(addr);
    }
}
