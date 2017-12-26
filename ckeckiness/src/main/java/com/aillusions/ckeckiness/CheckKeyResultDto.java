package com.aillusions.luckiness.web;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

/**
 * @author aillusions
 */
@Data
@AllArgsConstructor
public class CheckKeyResultDto {

    private Boolean checkedKeyFound;
    private Set<String> checkedKeysMatched = new HashSet<>();
}
