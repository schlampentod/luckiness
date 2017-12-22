package com.aillusions.luckiness.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author aillusions
 */
@Data
@AllArgsConstructor@NoArgsConstructor
public class AddressesResultDto {

    private String privateKeyAsHex;
    private String publicKeyAsHex;

    private String privateKeyAsWIF;
    private String publicAddressAsHex;
}
