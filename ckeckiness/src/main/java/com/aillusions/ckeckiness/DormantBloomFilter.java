package com.aillusions.ckeckiness;

import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.List;

/**
 * Put /addr_all.bin to /luckiness/ckeckiness/src/main/resources/addr_all.bin
 *
 * @author aillusions
 */
public class DormantBloomFilter {

    public static final String UTF_8 = "UTF-8";

    private BloomFilter filter;

    public DormantBloomFilter(List<String> listOfLines) {

        long start = System.currentTimeMillis();

        try {
            InputStream blloomSerialized = DormantBloomFilter.class.getClassLoader().getResourceAsStream("addr_all.bin");
            filter = BloomFilter.readFrom(blloomSerialized, Funnels.stringFunnel(Charset.forName("UTF-8")));
        } catch (IOException e) {
            filter = null;
            e.printStackTrace();
        }

        if (filter == null) {
            filter = BloomFilter.create(
                    Funnels.stringFunnel(Charset.forName(UTF_8)),
                    listOfLines.size(),
                    0.00000000000000001/*1F / listOfLines.size()*/);

            for (String address : listOfLines) {
                filter.put(address);
            }
        }

        System.out.println("DormantBloomFilter with " + filter.approximateElementCount() + " elements initialized in: " + (System.currentTimeMillis() - start) + " ms.");
    }

    public boolean has(String addr) {
        return filter.mightContain(addr);
    }
}
