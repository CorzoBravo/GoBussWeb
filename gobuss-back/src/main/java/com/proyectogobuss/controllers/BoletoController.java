package com.proyectogobuss.controllers;

import com.proyectogobuss.Entities.Boleto;
import com.proyectogobuss.services.BoletoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boletos")
@RequiredArgsConstructor
public class BoletoController {

    private final BoletoService boletoService;

    @PostMapping("/{id}/procesar")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA', 'USUARIO')")
    public ResponseEntity<Void> procesarYEnviarBoleto(@PathVariable Integer id) {
        Boleto boleto = new Boleto();
        boleto.setIdBoleto(id);
        boletoService.procesarYEnviarBoleto(boleto);
        return ResponseEntity.ok().build();
    }
}
