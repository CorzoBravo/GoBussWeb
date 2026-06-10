package com.proyectogobuss.dto;

import java.sql.Date;
import java.time.LocalDate;

public class ReporteVentasFechaDTO {

    private LocalDate fecha;
    private long cantidadBoletos;
    private double totalVendido;

    public ReporteVentasFechaDTO(
            Date fecha,
            Long cantidadBoletos,
            Double totalVendido
    ) {
        this.fecha = fecha.toLocalDate();
        this.cantidadBoletos = cantidadBoletos;
        this.totalVendido = totalVendido;
    }

    public ReporteVentasFechaDTO(
            LocalDate fecha,
            long cantidadBoletos,
            double totalVendido
    ) {
        this.fecha = fecha;
        this.cantidadBoletos = cantidadBoletos;
        this.totalVendido = totalVendido;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public long getCantidadBoletos() {
        return cantidadBoletos;
    }

    public double getTotalVendido() {
        return totalVendido;
    }
}
