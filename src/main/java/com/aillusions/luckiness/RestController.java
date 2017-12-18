package com.aillusions.luckiness;

import lombok.Setter;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.params.MainNetParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

/**
 * @author aillusions
 */
@org.springframework.web.bind.annotation.RestController()
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/rest/v1/lucky")
@Setter
public class RestController {

    private DormantBloomFilter bloomFilter;

    {
        DormantAddressProvider prov = new DormantAddressProvider();
        bloomFilter = new DormantBloomFilter(prov.getDormantAddresses());
    }

    @Autowired
    private AsyncService asyncService;

    // http://localhost:8080/rest/v1/lucky/about
    @RequestMapping(value = "/about", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AboutDto about() throws InterruptedException {
        return new AboutDto();
    }

    // http://localhost:8080/rest/v1/lucky/check/245364787645342312142536754
    @RequestMapping(value = "/check/{providedKeyValue}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public CheckKeyResultDto about(@PathVariable String providedKeyValue) throws InterruptedException {

        ECKey key;
        String testBtcAddress;

        key = getNewECKey(providedKeyValue);
        testBtcAddress = getBtcAddress(key);

        // String privateKeyAsHex = key.getPrivateKeyAsHex();
        // String publicKeyAsHex = key.getPublicKeyAsHex();

        return new CheckKeyResultDto(bloomFilter.has(testBtcAddress));
    }

    public static ECKey getNewECKey(String providedKeyValue) {
        return ECKey.fromPrivate(new BigInteger(providedKeyValue));
    }

    public static String getBtcAddress(ECKey key) {

        final NetworkParameters netParams = MainNetParams.get();
        Address addressFromKey = key.toAddress(netParams);

        return addressFromKey.toBase58();
    }
}
