package com.finance.dashboard.controller;

import com.finance.dashboard.dto.DashboardSummaryDTO;
import com.finance.dashboard.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard", description = "Aggregated financial summaries and trends")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(
        summary = "Get financial summary",
        description = "Returns total income, expense, balance, category totals, and recent transactions"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Summary returned"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @Operation(
        summary = "Get monthly trends",
        description = "Returns monthly income, expense, and balance for a given year"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Trend data returned"),
        @ApiResponse(responseCode = "400", description = "Invalid year"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/trends")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    public ResponseEntity<Map<String, Object>> getTrends(
            @Parameter(description = "Year (default = current year)")
            @RequestParam(required = false) Integer year) {

        int targetYear = (year != null) ? year : LocalDate.now().getYear();

        return ResponseEntity.ok(dashboardService.getMonthlyTrends(targetYear));
    }
}