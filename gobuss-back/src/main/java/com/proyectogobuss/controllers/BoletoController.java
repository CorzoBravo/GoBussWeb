package com.proyectogobuss.controllers;

import com.proyectogobuss.Entities.Boleto;
import com.proyectogobuss.dto.boleto.BoletoCreateRequest;
import com.proyectogobuss.dto.boleto.BoletoDTO;
import com.proyectogobuss.services.BoletoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boletos")
@RequiredArgsConstructor
public class BoletoController {

    private final BoletoService boletoService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA', 'USUARIO')")
    public ResponseEntity<BoletoDTO> crearBoleto(@Valid @RequestBody BoletoCreateRequest request, Authentication authentication) {
        String usuarioCedula = authentication.getName(); // JWT subject (ID of user)
        BoletoDTO boletoDTO = boletoService.crearBoleto(request, usuarioCedula);
        return ResponseEntity.ok(boletoDTO);
    }

    @PostMapping("/{id}/procesar")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA', 'USUARIO')")
    public ResponseEntity<Void> procesarYEnviarBoleto(@PathVariable Integer id) {
        Boleto boleto = new Boleto();
        boleto.setIdBoleto(id);
        boletoService.procesarYEnviarBoleto(boleto);
        return ResponseEntity.ok().build();
    }
}
