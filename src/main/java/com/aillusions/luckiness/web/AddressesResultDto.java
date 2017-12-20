package com.aillusions.luckiness.web;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author aillusions
 */
@Data
@AllArgsConstructor
public class AddressesResultDto {

    private String privateKeyAsHex;
    private String publicKeyAsHex;
    private String publicAddressAsHex;
}
