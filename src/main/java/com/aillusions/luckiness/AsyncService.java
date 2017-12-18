package com.aillusions.luckiness;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * @author aillusions
 */
@EnableAsync
@Service
public class AsyncService {

    @Async()
    public void asyncDo() {
        System.out.println("asyncDo..");
    }

    @Scheduled(cron = "0 * * * * *")// Every minute
    public void scheduledTask() {
        System.out.println("scheduledTask..");
    }

}
