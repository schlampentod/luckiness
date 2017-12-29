package com.aillusions.luckiness;

import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * @author aillusions
 */
public class DormantAddressProvider {

    private List<String> listOfLines;

    public DormantAddressProvider() {

        listOfLines = new ArrayList<>();

        try {
            BufferedReader bufReader = new BufferedReader(new InputStreamReader(DormantAddressProvider.class.getClassLoader().getResourceAsStream("dormant.txt")));

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

    public List<String> getDormantAddresses() {
        return listOfLines;
    }
}
