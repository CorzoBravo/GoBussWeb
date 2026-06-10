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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        AdminDashboardDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
