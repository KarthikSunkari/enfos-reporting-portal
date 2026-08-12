package com.enfos.reporting.model;

public record DepartmentReportRow(
        String departmentId,
        String departmentName,
        String manager,
        int employeeCount,
        String location) {
}
