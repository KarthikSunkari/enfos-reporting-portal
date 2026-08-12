package com.enfos.reporting;

import com.enfos.reporting.config.CorsProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CorsProperties.class)
public class EnfosReportingApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnfosReportingApplication.class, args);
    }
}
