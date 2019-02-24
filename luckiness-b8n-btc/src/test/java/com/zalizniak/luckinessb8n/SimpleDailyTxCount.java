package com.zalizniak.luckinessb8n;

import org.apache.commons.lang3.StringUtils;
import org.bitcoinj.core.*;
import org.bitcoinj.params.MainNetParams;
import org.bitcoinj.script.Script;
import org.bitcoinj.utils.BlockFileLoader;

import java.io.File;
import java.util.*;

/**
 * https://www.blockchain.com/btc/tx/6f7cf9580f1c2dfb3c4d5d043cdbb128c640e3f20161245aa7372e9666168516
 * https://www.blockchain.com/btc/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
 */
public class SimpleDailyTxCount {

    // Location of block files. This is where your blocks are located.
    // Check the documentation of Bitcoin Core if you are using
    // it, or use any other directory with blk*dat files.
    static String PREFIX = "d:\\bl_chain_data\\blocks\\";

    Map<String, Long> addresses = new HashMap<>();

    // A simple method with everything in it
    public void doSomething() {

        // Just some initial setup
        NetworkParameters np = new MainNetParams();
        Context.getOrCreate(MainNetParams.get());

        BlockFileLoader loader = new BlockFileLoader(np, buildList());

        // A simple counter to have an idea of the progress
        int blockCounter = 0;

        for (Block block : loader) {

            blockCounter++;
            // This gives you an idea of the progress
            System.out.println("Analysing block " + blockCounter);

            for (Transaction tx : block.getTransactions()) {

                String txHash = tx.getHashAsString();
                //System.out.println("txHash: " + txHash);

                String inputFromAddress = "";

                int inputsNum = tx.getInputs().size();
                if (inputsNum == 1 && tx.getInputs().get(0).isCoinBase()) {
                    inputFromAddress = "CoinBase";
                } else {
                    for (TransactionInput input : tx.getInputs()) {
                        try {
                            if (input.getScriptSig() != null) {
                                input.getScriptSig().isSentToAddress();
                                //    input.getScriptSig().getFromAddress(np);
                                //    input.getScriptSig().getToAddress(np, true);
                            }
                            inputFromAddress = input.getFromAddress().toBase58();
                            //System.out.println("fromAddress: " + inputFromAddress);
                        } catch (ScriptException e) {
                            //System.out.println("txHash: " + txHash);
                            //System.out.println(input);
                        }
                    }
                }

                int outputsNum = tx.getInputs().size();
                for (TransactionOutput output : tx.getOutputs()) {

                    Script script = output.getScriptPubKey();

                    String fromAddress = "?????";
                    String addressFromP2SH = null;
                    String addressFromP2PKHScript = null;
                    try {
                        addressFromP2SH = output.getScriptPubKey().isPayToScriptHash() ? output.getAddressFromP2SH(np).toBase58() : null;
                        addressFromP2PKHScript = output.getScriptPubKey().isSentToAddress() ? output.getAddressFromP2PKHScript(np).toBase58() : null;
                        if (addressFromP2PKHScript == null) {
                            fromAddress = script.getFromAddress(np).toBase58();
                        }
                    } catch (ScriptException | IllegalArgumentException e) {
                        //System.out.println("txHash: " + txHash);
                        //System.err.println("Error fromAddress: " + e.getMessage());
                        //System.out.println(output);
                    }

                    String toAddress = "?????";
                    try {
                        toAddress = script.getToAddress(np, true).toBase58();
                    } catch (ScriptException | IllegalArgumentException e) {
                        System.out.println("txHash: " + txHash);
                        //System.err.println("Error toAddress: " + e.getMessage());
                        System.out.println(output);
                    }

                    if (StringUtils.endsWithIgnoreCase(fromAddress, toAddress)) {
                        fromAddress = "?????";
                    }

                    long amnt = output.getValue().getValue();
                    //System.out.println("fromAddress: " + fromAddress + " amount: " + (amnt/* / 100000000*/) + " toAddress: " + toAddress);

                    register(addresses, fromAddress, -amnt);
                    register(addresses, toAddress, amnt);
                }
                //dailyTotTxs.put(day, dailyTotTxs.get(day) + 1);
            }

            // break;
        } // End of iteration over blocks

        // Finally, let's print the results
        for (String address : addresses.keySet()) {
            if (addresses.get(address) > 1000) {
                System.out.println(address + "," + addresses.get(address));
            }
        }
    }  // end of doSomething() method.

    private static void set(Map<String, Long> map, String address, Long amnt) {
        long amount = amnt == null ? 0 : amnt;
        if (map.get(address) == null) {
            map.put(address, amount);
        } else {
            map.put(address, amount);
        }
    }

    private static void register(Map<String, Long> map, String address, Long amnt) {
        long amount = amnt == null ? 0 : amnt;
        if (map.get(address) == null) {
            map.put(address, amount);
        } else {
            long old = map.get(address);
            map.put(address, old + amount);
        }
    }

    // The method returns a list of files in a directory according to a certain
    // pattern (block files have name blkNNNNN.dat)
    private List<File> buildList() {
        List<File> list = new LinkedList<File>();
        for (int i = 0; true; i++) {
            File file = new File(PREFIX + String.format(Locale.US, "blk%05d.dat", i));
            if (!file.exists())
                break;
            list.add(file);
        }
        return list;
    }


    // Main method: simply invoke everything
    public static void main(String[] args) {
        SimpleDailyTxCount tb = new SimpleDailyTxCount();
        tb.doSomething();
    }

}
