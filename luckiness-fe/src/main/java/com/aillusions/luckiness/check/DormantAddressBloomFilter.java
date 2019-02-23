package com.aillusions.luckiness.check;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;

/**
 * @author aillusions
 */
@Slf4j
@Service
public class DormantAddressBloomFilter implements PkBloomFilter {

    private Set<String> listOfLines;

    @Override
    public boolean has(String addr) {
        return listOfLines.contains(addr);
    }

    public DormantAddressBloomFilter() {

        listOfLines = new HashSet<>();

        try {
            BufferedReader bufReader = new BufferedReader(
                    new InputStreamReader(DormantAddressBloomFilter.class
                            .getClassLoader()
                            .getResourceAsStream("dormant.txt")));
            String line;

            do {
                line = bufReader.readLine();
                if (StringUtils.isNotBlank(line) && !StringUtils.startsWith(line, "3")) {
                    listOfLines.add(line);
                }
            } while (line != null);

            bufReader.close();
        } catch (IOException e) {
            log.error("Failure to read dormant.txt", e);
        }

        log.info("Loaded: " + listOfLines.size() + " addresses.");

    }
}
