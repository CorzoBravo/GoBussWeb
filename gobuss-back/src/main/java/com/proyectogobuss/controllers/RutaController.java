package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.ruta.*;
import com.proyectogobuss.services.RutaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutas")
@RequiredArgsConstructor
public class RutaController {

    private final RutaService rutaService;

    // CIUDADES
    @GetMapping("/ciudades")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<CiudadDTO>> getAllCiudades() {
        List<CiudadDTO> ciudades = rutaService.getAllCiudades();
        return ResponseEntity.ok(ciudades);
    }

    @PostMapping("/ciudades")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CiudadDTO> createCiudad(@Valid @RequestBody CiudadCreateRequest request) {
        CiudadDTO ciudad = rutaService.createCiudad(request);
        return new ResponseEntity<>(ciudad, HttpStatus.CREATED);
    }

    @DeleteMapping("/ciudades/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCiudad(@PathVariable Integer id) {
        rutaService.deleteCiudad(id);
        return ResponseEntity.noContent().build();
    }

    // RUTAS GENERALES
    @GetMapping("/generales")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<RutaGeneralDTO>> getAllRutasGenerales() {
        List<RutaGeneralDTO> rutas = rutaService.getAllRutasGenerales();
        return ResponseEntity.ok(rutas);
    }

    @PostMapping("/generales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RutaGeneralDTO> createRutaGeneral(@Valid @RequestBody RutaGeneralCreateRequest request) {
        RutaGeneralDTO ruta = rutaService.createRutaGeneral(request);
        return new ResponseEntity<>(ruta, HttpStatus.CREATED);
    }

    // RUTAS FINALES (por Cooperativa)
    @GetMapping("/cooperativas/{ruc}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<RutaFinalDTO>> getRutasByCooperativa(@PathVariable String ruc) {
        List<RutaFinalDTO> rutas = rutaService.getRutasByCooperativa(ruc);
        return ResponseEntity.ok(rutas);
    }

    @PostMapping("/cooperativas/{ruc}")
    @PreAuthorize("hasRole('COOPERATIVA')")
    public ResponseEntity<RutaFinalDTO> addRutaToCooperativa(@PathVariable String ruc,
                                                             @Valid @RequestBody RutaFinalCreateRequest request) {
        RutaFinalDTO ruta = rutaService.addRutaToCooperativa(ruc, request);
        return new ResponseEntity<>(ruta, HttpStatus.CREATED);
    }

    @PutMapping("/cooperativas/{ruc}/{rutaId}")
    @PreAuthorize("hasRole('COOPERATIVA')")
    public ResponseEntity<RutaFinalDTO> updateRutaFinal(@PathVariable String ruc,
                                                        @PathVariable Integer rutaId,
                                                        @Valid @RequestBody RutaFinalUpdateRequest request) {
        RutaFinalDTO ruta = rutaService.updateRutaFinal(ruc, rutaId, request);
        return ResponseEntity.ok(ruta);
    }

    @DeleteMapping("/cooperativas/{ruc}/{rutaId}")
    @PreAuthorize("hasRole('COOPERATIVA')")
    public ResponseEntity<Void> deleteRutaFinal(@PathVariable String ruc,
                                                 @PathVariable Integer rutaId) {
        rutaService.deleteRutaFinal(ruc, rutaId);
        return ResponseEntity.noContent().build();
    }
}
