package com.proyectogobuss.services;

import com.proyectogobuss.dto.ReporteOcupacionHorarioDTO;
import com.proyectogobuss.dto.ReporteVentasFechaDTO;
import com.proyectogobuss.dto.ReporteVentasRutaDTO;
import com.proyectogobuss.repositories.BoletoRepository;
import com.proyectogobuss.repositories.HorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final BoletoRepository boletoRepository;
    private final HorarioRepository horarioRepository;

    public List<ReporteVentasRutaDTO> ventasPorRuta(String rucCooperativa) {
        return boletoRepository.reporteVentasPorRuta(rucCooperativa);
    }

    public List<ReporteVentasFechaDTO> ventasPorFecha(
            String ruc,
            LocalDate inicio,
            LocalDate fin) {
        return boletoRepository.ventasPorFecha(ruc, inicio, fin);
    }

    public List<ReporteOcupacionHorarioDTO> ocupacionPorHorario(
            String ruc,
            LocalDate inicio,
            LocalDate fin) {
        return horarioRepository.ocupacionPorHorario(ruc, inicio, fin);
    }
}
