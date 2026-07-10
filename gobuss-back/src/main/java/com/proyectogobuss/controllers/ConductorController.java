package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.conductor.ConductorCreateRequest;
import com.proyectogobuss.dto.conductor.ConductorDTO;
import com.proyectogobuss.dto.conductor.ConductorUpdateRequest;
import com.proyectogobuss.services.ConductorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooperativas/{ruc}/conductores")
@RequiredArgsConstructor
public class ConductorController {

    private final ConductorService conductorService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
    public ResponseEntity<List<ConductorDTO>> getByCooperativa(@PathVariable String ruc) {
        return ResponseEntity.ok(conductorService.getByCooperativa(ruc));
    }

    @GetMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
    public ResponseEntity<ConductorDTO> getById(@PathVariable String ruc, @PathVariable String cedula) {
        return ResponseEntity.ok(conductorService.getById(ruc, cedula));
    }

    @PostMapping
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<ConductorDTO> create(
            @PathVariable String ruc,
            @Valid @RequestBody ConductorCreateRequest request) {
        return new ResponseEntity<>(conductorService.create(ruc, request), HttpStatus.CREATED);
    }

    @PutMapping("/{cedula}")
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<ConductorDTO> update(
            @PathVariable String ruc,
            @PathVariable String cedula,
            @Valid @RequestBody ConductorUpdateRequest request) {
        return ResponseEntity.ok(conductorService.update(ruc, cedula, request));
    }

    @DeleteMapping("/{cedula}")
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<Void> delete(@PathVariable String ruc, @PathVariable String cedula) {
        conductorService.delete(ruc, cedula);
        return ResponseEntity.noContent().build();
    }
}
