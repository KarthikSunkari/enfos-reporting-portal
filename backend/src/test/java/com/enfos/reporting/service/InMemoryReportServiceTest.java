package com.enfos.reporting.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class InMemoryReportServiceTest {

    private final InMemoryReportService reportService = new InMemoryReportService();

    @Test
    void exposesExactlyTheThreeRequiredReports() {
        assertThat(reportService.getReports())
                .extracting(report -> report.id())
                .containsExactly("users", "departments", "projects");
    }

    @Test
    void metadataRowCountsMatchReportData() {
        assertThat(reportService.getReports().get(0).rowCount()).isEqualTo(reportService.getUsers().size());
        assertThat(reportService.getReports().get(1).rowCount()).isEqualTo(reportService.getDepartments().size());
        assertThat(reportService.getReports().get(2).rowCount()).isEqualTo(reportService.getProjects().size());
    }

    @Test
    void mockDataCannotBeMutatedByConsumers() {
        assertThatThrownBy(() -> reportService.getUsers().clear())
                .isInstanceOf(UnsupportedOperationException.class);
    }
}
