package com.enfos.reporting.service;

import com.enfos.reporting.model.DepartmentReportRow;
import com.enfos.reporting.model.ProjectReportRow;
import com.enfos.reporting.model.ReportSummary;
import com.enfos.reporting.model.UserReportRow;
import java.util.List;

public interface ReportService {

    List<ReportSummary> getReports();

    List<UserReportRow> getUsers();

    List<DepartmentReportRow> getDepartments();

    List<ProjectReportRow> getProjects();
}
