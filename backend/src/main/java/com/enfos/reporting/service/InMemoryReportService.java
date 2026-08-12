package com.enfos.reporting.service;

import com.enfos.reporting.model.DepartmentReportRow;
import com.enfos.reporting.model.ProjectReportRow;
import com.enfos.reporting.model.ReportSummary;
import com.enfos.reporting.model.UserReportRow;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InMemoryReportService implements ReportService {

    private static final List<UserReportRow> USERS = List.of(
            new UserReportRow(
                    "USR-1001", "Maya Patel", "maya.patel@enfos.example", "Administrator",
                    "Active", "Chicago, IL", LocalDate.of(2022, 3, 14)),
            new UserReportRow(
                    "USR-1002", "Ethan Brooks", "ethan.brooks@enfos.example", "Project Manager",
                    "Active", "Denver, CO", LocalDate.of(2022, 8, 22)),
            new UserReportRow(
                    "USR-1003", "Sofia Ramirez", "sofia.ramirez@enfos.example", "Analyst",
                    "Active", "Austin, TX", LocalDate.of(2023, 1, 9)),
            new UserReportRow(
                    "USR-1004", "Noah Williams", "noah.williams@enfos.example", "Viewer",
                    "Inactive", "Boston, MA", LocalDate.of(2023, 6, 5)),
            new UserReportRow(
                    "USR-1005", "Ava Chen", "ava.chen@enfos.example", "Analyst",
                    "Active", "Seattle, WA", LocalDate.of(2024, 2, 19)),
            new UserReportRow(
                    "USR-1006", "Liam Johnson", "liam.johnson@enfos.example", "Project Manager",
                    "Pending", "Atlanta, GA", LocalDate.of(2025, 11, 3)));

    private static final List<DepartmentReportRow> DEPARTMENTS = List.of(
            new DepartmentReportRow(
                    "DEP-101", "Environmental Compliance", "Maya Patel", 24, "Chicago, IL"),
            new DepartmentReportRow(
                    "DEP-102", "Remediation Services", "Ethan Brooks", 18, "Denver, CO"),
            new DepartmentReportRow(
                    "DEP-103", "Data & Analytics", "Sofia Ramirez", 12, "Austin, TX"),
            new DepartmentReportRow("DEP-104", "Client Operations", "Olivia Martin", 31, "Boston, MA"));

    private static final List<ProjectReportRow> PROJECTS = List.of(
            new ProjectReportRow(
                    "PRJ-2401", "North Harbor Remediation", "Remediation Services", "Ethan Brooks",
                    "In Progress", LocalDate.of(2025, 9, 15), LocalDate.of(2026, 12, 18)),
            new ProjectReportRow(
                    "PRJ-2402", "Compliance Data Modernization", "Data & Analytics", "Sofia Ramirez",
                    "In Progress", LocalDate.of(2026, 1, 12), LocalDate.of(2026, 10, 30)),
            new ProjectReportRow(
                    "PRJ-2403", "Midwest Site Audit", "Environmental Compliance", "Maya Patel",
                    "Completed", LocalDate.of(2025, 4, 7), LocalDate.of(2026, 2, 27)),
            new ProjectReportRow(
                    "PRJ-2404", "Client Reporting Refresh", "Client Operations", "Olivia Martin",
                    "Planned", LocalDate.of(2026, 9, 1), LocalDate.of(2027, 3, 31)),
            new ProjectReportRow(
                    "PRJ-2405", "Legacy Records Migration", "Data & Analytics", "Ava Chen",
                    "On Hold", LocalDate.of(2025, 11, 10), LocalDate.of(2026, 8, 28)));

    private static final List<ReportSummary> REPORTS = List.of(
            new ReportSummary(
                    "users", "Users", "People with access to the reporting platform.",
                    Instant.parse("2026-08-11T19:20:00Z"), USERS.size()),
            new ReportSummary(
                    "departments", "Departments", "Teams, managers, staffing, and office locations.",
                    Instant.parse("2026-08-10T14:05:00Z"), DEPARTMENTS.size()),
            new ReportSummary(
                    "projects", "Projects", "Active, planned, and completed environmental work.",
                    Instant.parse("2026-08-12T00:35:00Z"), PROJECTS.size()));

    @Override
    public List<ReportSummary> getReports() {
        return REPORTS;
    }

    @Override
    public List<UserReportRow> getUsers() {
        return USERS;
    }

    @Override
    public List<DepartmentReportRow> getDepartments() {
        return DEPARTMENTS;
    }

    @Override
    public List<ProjectReportRow> getProjects() {
        return PROJECTS;
    }
}
