package com.aillusions.luckiness;

import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;

import java.nio.charset.Charset;
import java.util.List;

/**
 * @author aillusions
 */
public class DormantBloomFilter {

    public static final String UTF_8 = "UTF-8";

    private BloomFilter filter;

    public DormantBloomFilter(List<String> listOfLines) {

        filter = BloomFilter.create(
                Funnels.stringFunnel(Charset.forName(UTF_8)),
                listOfLines.size(),
                1F / listOfLines.size());

        for (String address : listOfLines) {
            filter.put(address);
        }
    }

    public boolean has(String addr) {
        return filter.mightContain(addr);
    }
}
