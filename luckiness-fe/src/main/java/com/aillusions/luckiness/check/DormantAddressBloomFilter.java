package com.aillusions.luckiness.check;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * @author aillusions
 */
@Service
public class DormantAddressBloomFilter implements PkBloomFilter {

    private List<String> listOfLines;

    @Override
    public boolean has(String addr) {
        return listOfLines.contains(addr);
    }

    public DormantAddressBloomFilter() {

        listOfLines = new ArrayList<>();

        try {
            BufferedReader bufReader = new BufferedReader(new InputStreamReader(DormantAddressBloomFilter.class.getClassLoader().getResourceAsStream("dormant.txt")));

            String line;

            do {
                line = bufReader.readLine();
                if (StringUtils.isNotBlank(line) && !StringUtils.startsWith(line, "3")) {
                    listOfLines.add(line);
                }
            } while (line != null);

            bufReader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
