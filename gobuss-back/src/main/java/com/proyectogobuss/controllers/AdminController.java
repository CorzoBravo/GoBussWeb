package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.admin.AdminDashboardDTO;
import com.proyectogobuss.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats(org.springframework.security.core.Authentication authentication) {
        boolean isCooperativa = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COOPERATIVA"));
        String ruc = isCooperativa ? authentication.getName() : null;
        AdminDashboardDTO stats = adminService.getDashboardStats(ruc);
        return ResponseEntity.ok(stats);
    }
}
