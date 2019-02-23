package com.aillusions.luckiness.web.model;

import lombok.Data;

import java.util.LinkedList;
import java.util.List;

/**
 * @author aillusions
 */
@Data
public class KnownKeysDto {

    private List<KnownKeyDto> knownKeyDtos = new LinkedList<>();
}
