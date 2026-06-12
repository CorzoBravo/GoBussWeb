package com.proyectogobuss.controllers;

import com.proyectogobuss.services.ReservaTemporalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaTemporalController {

    private final ReservaTemporalService reservaService;

    @PostMapping
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<Void> reservarAsientos(
            @RequestParam Integer horarioId,
            @RequestBody List<Integer> asientosIds,
            Authentication auth) {
        reservaService.reservarAsientos(horarioId, asientosIds, auth.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{asientoId}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<Void> cancelarReserva(@PathVariable Integer asientoId, Authentication auth) {
        reservaService.cancelarReserva(asientoId, auth.getName());
        return ResponseEntity.ok().build();
    }
}
