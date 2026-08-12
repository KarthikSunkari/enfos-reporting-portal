package com.enfos.reporting.model;

import java.time.LocalDate;

public record ProjectReportRow(
        String projectId,
        String projectName,
        String department,
        String owner,
        String status,
        LocalDate startDate,
        LocalDate endDate) {
}
