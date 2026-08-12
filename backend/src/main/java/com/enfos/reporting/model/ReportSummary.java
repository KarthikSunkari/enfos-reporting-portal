package com.enfos.reporting.model;

import java.time.Instant;

public record ReportSummary(
        String id,
        String name,
        String description,
        Instant lastUpdated,
        int rowCount) {
}
