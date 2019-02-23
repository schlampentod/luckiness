package com.aillusions.luckiness.web;

import com.aillusions.luckiness.CheckBatchResponse;
import com.aillusions.luckiness.KeyUtils;
import com.aillusions.luckiness.check.KeyChecker;
import com.aillusions.luckiness.web.model.CheckKeyResultDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

/**
 * @author aillusions
 */
@Slf4j
@RestController()
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/rest/v1/checky")
public class CheckRestController {

    @Autowired
    private KeyChecker keyChecker;

    // http://localhost:8080/rest/v1/checky/check/batch/245364787645342312142536754
    @RequestMapping(value = "/check/batch/{providedKey}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public CheckKeyResultDto check(@PathVariable String providedKey) throws InterruptedException {

        CheckBatchResponse checkBatchResponse = null;
        try {
            log.debug("Checking " + providedKey);
            KeyUtils.validateKeyValue(providedKey);
            checkBatchResponse = keyChecker.checkKey(providedKey);
            return new CheckKeyResultDto(!checkBatchResponse.getFoundKeys().isEmpty(), checkBatchResponse.getFoundKeys());

        } catch (Exception e) {
            log.debug("Unable to check key: " + ExceptionUtils.getMessage(e));
            return new CheckKeyResultDto(false, Collections.EMPTY_SET);
        }
    }
}
