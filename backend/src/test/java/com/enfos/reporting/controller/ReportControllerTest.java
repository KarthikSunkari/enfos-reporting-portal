package com.enfos.reporting.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.enfos.reporting.config.CorsProperties;
import com.enfos.reporting.config.WebConfig;
import com.enfos.reporting.model.DepartmentReportRow;
import com.enfos.reporting.model.ProjectReportRow;
import com.enfos.reporting.model.ReportSummary;
import com.enfos.reporting.model.UserReportRow;
import com.enfos.reporting.service.ReportService;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ReportController.class)
@Import(WebConfig.class)
@EnableConfigurationProperties(CorsProperties.class)
class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReportService reportService;

    @Test
    void returnsReportMetadata() throws Exception {
        when(reportService.getReports()).thenReturn(List.of(
                new ReportSummary("users", "Users", "People in the system", Instant.parse("2026-08-11T19:20:00Z"), 6)));

        mockMvc.perform(get("/api/reports").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("users"))
                .andExpect(jsonPath("$[0].rowCount").value(6));
    }

    @Test
    void returnsUserRows() throws Exception {
        when(reportService.getUsers()).thenReturn(List.of(
                new UserReportRow("USR-1001", "Maya Patel", "maya@enfos.example", "Administrator", "Active", "Chicago, IL", LocalDate.of(2022, 3, 14))));

        mockMvc.perform(get("/api/reports/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value("USR-1001"))
                .andExpect(jsonPath("$[0].createdDate").value("2022-03-14"));
    }

    @Test
    void returnsDepartmentRows() throws Exception {
        when(reportService.getDepartments()).thenReturn(List.of(
                new DepartmentReportRow("DEP-101", "Environmental Compliance", "Maya Patel", 24, "Chicago, IL")));

        mockMvc.perform(get("/api/reports/departments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].departmentId").value("DEP-101"))
                .andExpect(jsonPath("$[0].employeeCount").value(24));
    }

    @Test
    void returnsProjectRows() throws Exception {
        when(reportService.getProjects()).thenReturn(List.of(
                new ProjectReportRow("PRJ-2401", "North Harbor Remediation", "Remediation Services", "Ethan Brooks", "In Progress", LocalDate.of(2025, 9, 15), LocalDate.of(2026, 12, 18))));

        mockMvc.perform(get("/api/reports/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].projectId").value("PRJ-2401"))
                .andExpect(jsonPath("$[0].endDate").value("2026-12-18"));
    }

    @Test
    void allowsConfiguredFrontendOrigin() throws Exception {
        mockMvc.perform(options("/api/reports")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, HttpMethod.GET.name()))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"));
    }

    @Test
    void rejectsUnknownFrontendOrigin() throws Exception {
        mockMvc.perform(options("/api/reports")
                        .header(HttpHeaders.ORIGIN, "https://untrusted.example")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, HttpMethod.GET.name()))
                .andExpect(status().isForbidden());
    }
}
