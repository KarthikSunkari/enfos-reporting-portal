package com.enfos.reporting.controller;

import com.enfos.reporting.model.DepartmentReportRow;
import com.enfos.reporting.model.ProjectReportRow;
import com.enfos.reporting.model.ReportSummary;
import com.enfos.reporting.model.UserReportRow;
import com.enfos.reporting.service.ReportService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/reports", produces = MediaType.APPLICATION_JSON_VALUE)
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReportSummary> getReports() {
        return reportService.getReports();
    }

    @GetMapping("/users")
    public List<UserReportRow> getUsers() {
        return reportService.getUsers();
    }

    @GetMapping("/departments")
    public List<DepartmentReportRow> getDepartments() {
        return reportService.getDepartments();
    }

    @GetMapping("/projects")
    public List<ProjectReportRow> getProjects() {
        return reportService.getProjects();
    }
}
