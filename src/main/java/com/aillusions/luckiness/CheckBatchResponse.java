package com.aillusions.luckiness;

import lombok.Data;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

/**
 * @author aillusions
 */
@Data
@ToString
public class CheckBatchResponse {
    private Set<String> foundKeys = new HashSet<>();
}
