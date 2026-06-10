package com.proyectogobuss.dto;

public class ReporteVentasRutaDTO {

    private String ruta;
    private long cantidadBoletos;
    private double totalVendido;

    public ReporteVentasRutaDTO(String ruta, long cantidadBoletos, double totalVendido) {
        this.ruta = ruta;
        this.cantidadBoletos = cantidadBoletos;
        this.totalVendido = totalVendido;
    }

    public String getRuta() {
        return ruta;
    }

    public long getCantidadBoletos() {
        return cantidadBoletos;
    }

    public double getTotalVendido() {
        return totalVendido;
    }
}
