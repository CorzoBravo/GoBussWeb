package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.cooperativa.CooperativaCreateRequest;
import com.proyectogobuss.dto.cooperativa.CooperativaDTO;
import com.proyectogobuss.dto.cooperativa.CooperativaUpdateRequest;
import com.proyectogobuss.services.CooperativaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooperativas")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CooperativaController {

    private final CooperativaService cooperativaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<CooperativaDTO>> getAll() {
        List<CooperativaDTO> cooperativas = cooperativaService.getAll();
        return ResponseEntity.ok(cooperativas);
    }

    @GetMapping("/{ruc}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<CooperativaDTO> getById(@PathVariable String ruc) {
        CooperativaDTO cooperativa = cooperativaService.getById(ruc);
        return ResponseEntity.ok(cooperativa);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<CooperativaDTO>> search(@RequestParam String q) {
        List<CooperativaDTO> cooperativas = cooperativaService.search(q);
        return ResponseEntity.ok(cooperativas);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CooperativaDTO> create(@Valid @RequestBody CooperativaCreateRequest request) {
        CooperativaDTO cooperativa = cooperativaService.create(request);
        return new ResponseEntity<>(cooperativa, HttpStatus.CREATED);
    }

    @PutMapping("/{ruc}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<CooperativaDTO> update(@PathVariable String ruc,
                                                 @Valid @RequestBody CooperativaUpdateRequest request) {
        CooperativaDTO cooperativa = cooperativaService.update(ruc, request);
        return ResponseEntity.ok(cooperativa);
    }

    @DeleteMapping("/{ruc}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String ruc) {
        cooperativaService.delete(ruc);
        return ResponseEntity.noContent().build();
    }
}
