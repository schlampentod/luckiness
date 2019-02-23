package com.aillusions.luckiness.check;

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
public class AllAddressesBloomFilter implements PkBloomFilter{
    @Override
    public boolean has(String pk) {
        return false;
    }
/*
    public static final String UTF_8 = "UTF-8";

    private BloomFilter filter;

    public static BloomFilter getBigBloomFilter() throws IOException {
        //URL boomSerUrl = AllAddressesBloomFilter.class.getClassLoader().getResource("addr_all.bin");
        //filter = BloomFilter.readFrom(boomSerUrl.openStream(), Funnels.stringFunnel(Charset.forName("UTF-8")));

        InputStream blloomSerialized = AllAddressesBloomFilter.class.getClassLoader().getResourceAsStream("addr_all.bin");
        return BloomFilter.readFrom(blloomSerialized, Funnels.stringFunnel(Charset.forName("UTF-8")));

            *//*filter = BloomFilter.readFrom(new FileInputStream("h:\\work\\luckiness\\ckeckiness\\src\\main\\resources\\addr_all.bin"),
                    Funnels.stringFunnel(Charset.forName("UTF-8")));*//*
    }

    public AllAddressesBloomFilter(List<String> listOfLines) {

        long start = System.currentTimeMillis();

        try {
            filter = getBigBloomFilter();

        } catch (IOException e) {
            filter = null;
            e.printStackTrace();
        }

        if (filter == null) {
            filter = BloomFilter.create(
                    Funnels.stringFunnel(Charset.forName(UTF_8)),
                    listOfLines.size(),
                    0.00000000000000001*//*1F / listOfLines.size()*//*);

            for (String address : listOfLines) {
                filter.put(address);
            }
        }

        System.out.println("AllAddressesBloomFilter with " + filter.approximateElementCount() + " elements initialized in: " + (System.currentTimeMillis() - start) + " ms.");
    }

    public boolean has(String addr) {
        return filter.mightContain(addr);
    }*/
}
