package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.ayudante.AyudanteCreateRequest;
import com.proyectogobuss.dto.ayudante.AyudanteDTO;
import com.proyectogobuss.dto.ayudante.AyudanteUpdateRequest;
import com.proyectogobuss.services.AyudanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooperativas/{ruc}/ayudantes")
@RequiredArgsConstructor
public class AyudanteController {

    private final AyudanteService ayudanteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
    public ResponseEntity<List<AyudanteDTO>> getByCooperativa(@PathVariable String ruc) {
        return ResponseEntity.ok(ayudanteService.getByCooperativa(ruc));
    }

    @GetMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
    public ResponseEntity<AyudanteDTO> getById(@PathVariable String ruc, @PathVariable String cedula) {
        return ResponseEntity.ok(ayudanteService.getById(ruc, cedula));
    }

    @PostMapping
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<AyudanteDTO> create(@PathVariable String ruc, @Valid @RequestBody AyudanteCreateRequest request) {
        return new ResponseEntity<>(ayudanteService.create(ruc, request), HttpStatus.CREATED);
    }

    @PutMapping("/{cedula}")
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<AyudanteDTO> update(
            @PathVariable String ruc,
            @PathVariable String cedula,
            @Valid @RequestBody AyudanteUpdateRequest request) {
        return ResponseEntity.ok(ayudanteService.update(ruc, cedula, request));
    }

    @DeleteMapping("/{cedula}")
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<Void> delete(@PathVariable String ruc, @PathVariable String cedula) {
        ayudanteService.delete(ruc, cedula);
        return ResponseEntity.noContent().build();
    }
}
