package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.unidad.UnidadCreateRequest;
import com.proyectogobuss.dto.unidad.UnidadDTO;
import com.proyectogobuss.dto.unidad.UnidadUpdateRequest;
import com.proyectogobuss.services.UnidadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooperativas/{ruc}/unidades")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UnidadController {

    private final UnidadService unidadService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<UnidadDTO>> getByCooperativa(@PathVariable String ruc) {
        List<UnidadDTO> unidades = unidadService.getByCooperativa(ruc);
        return ResponseEntity.ok(unidades);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<UnidadDTO> getById(@PathVariable Integer id) {
        UnidadDTO unidad = unidadService.getById(id);
        return ResponseEntity.ok(unidad);
    }

    @PostMapping
    @PreAuthorize("hasRole('COOPERATIVA')")
    public ResponseEntity<UnidadDTO> create(@PathVariable String ruc,
                                            @Valid @RequestBody UnidadCreateRequest request) {
        UnidadDTO unidad = unidadService.create(ruc, request);
        return new ResponseEntity<>(unidad, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COOPERATIVA')")
    public ResponseEntity<UnidadDTO> update(@PathVariable String ruc,
                                            @PathVariable Integer id,
                                            @Valid @RequestBody UnidadUpdateRequest request) {
        UnidadDTO unidad = unidadService.update(ruc, id, request);
        return ResponseEntity.ok(unidad);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COOPERATIVA')")
    public ResponseEntity<Void> delete(@PathVariable String ruc,
                                        @PathVariable Integer id) {
        unidadService.delete(ruc, id);
        return ResponseEntity.noContent().build();
    }
}
