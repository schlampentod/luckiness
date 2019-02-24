package com.zalizniak.luckinessb8n;

import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;

public class ImportAddresses {

    public static void main(String... args) throws IOException {
        // BufferedReader br = new BufferedReader(new FileReader("d:\\csv\\tx_out.csv.tmp"));

        BloomFilter<String> filter = BloomFilter.create(
                Funnels.stringFunnel(StandardCharsets.UTF_8),
                1_000_000_000,
                0.00000000000000001);


        AtomicInteger counter = new AtomicInteger();

        try (Stream<String> stream = Files.lines(Paths.get("d:\\csv\\tx_out.csv.tmp")).parallel()) {
            stream.forEach(line -> {
                int curr = counter.incrementAndGet();
                //System.out.println(Thread.currentThread().getName() + " - " + e);

                if (curr % 1000_000 == 0) {
                    System.out.println("Found: " + curr);
                }

                if (StringUtils.isNotBlank(line) && !StringUtils.startsWith(line, "3")) {

                    filter.put(line);
                }

            });
        }

        System.out.println("Found: " + counter);
    }
}
