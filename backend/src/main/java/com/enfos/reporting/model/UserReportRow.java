package com.enfos.reporting.model;

import java.time.LocalDate;

public record UserReportRow(
        String userId,
        String name,
        String email,
        String role,
        String status,
        String location,
        LocalDate createdDate) {
}
