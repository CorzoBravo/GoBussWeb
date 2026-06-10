package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.asiento.AsientoDTO;
import com.proyectogobuss.dto.horario.HorarioCreateRequest;
import com.proyectogobuss.dto.horario.HorarioDTO;
import com.proyectogobuss.services.HorarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HorarioController {

    private final HorarioService horarioService;

    @GetMapping("/cooperativa/{ruc}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<HorarioDTO>> getByCooperativa(@PathVariable String ruc) {
        return ResponseEntity.ok(horarioService.getByCooperativa(ruc));
    }

    @GetMapping("/ruta/{rutaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA', 'USUARIO')")
    public ResponseEntity<List<HorarioDTO>> getByRuta(@PathVariable Integer rutaId) {
        return ResponseEntity.ok(horarioService.getByRuta(rutaId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA', 'USUARIO')")
    public ResponseEntity<HorarioDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(horarioService.getById(id));
    }

    @PostMapping("/cooperativa/{ruc}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<HorarioDTO> create(
            @PathVariable String ruc,
            @Valid @RequestBody HorarioCreateRequest request) {
        return new ResponseEntity<>(horarioService.create(ruc, request), HttpStatus.CREATED);
    }

    @PatchMapping("/cooperativa/{ruc}/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<HorarioDTO> toggleStatus(
            @PathVariable String ruc,
            @PathVariable Integer id) {
        return ResponseEntity.ok(horarioService.toggleStatus(ruc, id));
    }

    @GetMapping("/{id}/asientos")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA', 'USUARIO')")
    public ResponseEntity<List<AsientoDTO>> getAsientos(@PathVariable Integer id) {
        return ResponseEntity.ok(horarioService.getAsientos(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<HorarioDTO>> searchAvailable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Integer origenId,
            @RequestParam Integer destinoId) {
        return ResponseEntity.ok(horarioService.searchAvailable(fecha, origenId, destinoId));
    }
}
