package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.horario.HorarioDTO;
import com.proyectogobuss.dto.horario.PasajeroDTO;
import com.proyectogobuss.services.HorarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/conductores-app")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CONDUCTOR')")
public class ConductorOperativoController {

    private final HorarioService horarioService;

    @GetMapping("/mis-horarios")
    public ResponseEntity<List<HorarioDTO>> getMisHorarios(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        String conductorCedula = authentication.getName(); // The username is the cedula
        LocalDate targetDate = (fecha != null) ? fecha : LocalDate.now();
        
        return ResponseEntity.ok(horarioService.getByConductor(conductorCedula, targetDate));
    }

    @GetMapping("/horarios/{id}/pasajeros")
    public ResponseEntity<List<PasajeroDTO>> getPasajerosByHorario(@PathVariable Integer id) {
        return ResponseEntity.ok(horarioService.getPasajerosByHorario(id));
    }
}
