package com.proyectogobuss.controllers;

import com.proyectogobuss.dto.ReporteOcupacionHorarioDTO;
import com.proyectogobuss.dto.ReporteVentasFechaDTO;
import com.proyectogobuss.dto.ReporteVentasRutaDTO;
import com.proyectogobuss.services.ReportePDFService;
import com.proyectogobuss.services.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cooperativas/{ruc}/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;
    private final ReportePDFService reportePDFService;

    @GetMapping("/ventas-ruta")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<ReporteVentasRutaDTO>> ventasPorRuta(@PathVariable String ruc) {
        return ResponseEntity.ok(reporteService.ventasPorRuta(ruc));
    }

    @GetMapping("/ventas-fecha")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<ReporteVentasFechaDTO>> ventasPorFecha(
            @PathVariable String ruc,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(reporteService.ventasPorFecha(ruc, inicio, fin));
    }

    @GetMapping("/ocupacion-horario")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<List<ReporteOcupacionHorarioDTO>> ocupacionPorHorario(
            @PathVariable String ruc,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(reporteService.ocupacionPorHorario(ruc, inicio, fin));
    }

    @GetMapping("/ventas-ruta/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
    public ResponseEntity<byte[]> ventasPorRutaPdf(@PathVariable String ruc) {
        try {
            List<ReporteVentasRutaDTO> datos = reporteService.ventasPorRuta(ruc);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            reportePDFService.generarReporteVentasRuta(datos, out);
            
            byte[] contents = out.toByteArray();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(org.springframework.http.ContentDisposition.attachment().filename("reporte_ventas_ruta.pdf").build());
            return ResponseEntity.ok().headers(headers).body(contents);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
