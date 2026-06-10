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
@RequestMapping("/api/ayudantes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AyudanteController {

    private final AyudanteService ayudanteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<AyudanteDTO>> getAll() {
        return ResponseEntity.ok(ayudanteService.getAll());
    }

    @GetMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<AyudanteDTO> getById(@PathVariable String cedula) {
        return ResponseEntity.ok(ayudanteService.getById(cedula));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<AyudanteDTO> create(@Valid @RequestBody AyudanteCreateRequest request) {
        return new ResponseEntity<>(ayudanteService.create(request), HttpStatus.CREATED);
    }

    @PutMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<AyudanteDTO> update(
            @PathVariable String cedula,
            @Valid @RequestBody AyudanteUpdateRequest request) {
        return ResponseEntity.ok(ayudanteService.update(cedula, request));
    }

    @DeleteMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<Void> delete(@PathVariable String cedula) {
        ayudanteService.delete(cedula);
        return ResponseEntity.noContent().build();
    }
}
