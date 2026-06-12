package com.proyectogobuss.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReporteOcupacionHorarioDTO {

    private String ruta;
    private LocalDate fecha;
    private LocalTime hora;
    private String unidad;
    private long asientosOcupados;
    private int capacidad;
    private double porcentaje;


    public ReporteOcupacionHorarioDTO(
            String ruta,
            LocalDate fecha,
            LocalTime hora,
            String unidad,
            Long asientosOcupados,
            Integer capacidad
    ) {
        this.ruta = ruta;
        this.fecha = fecha;
        this.hora = hora;
        this.unidad = unidad;
        this.asientosOcupados = asientosOcupados;
        this.capacidad = capacidad;
        this.porcentaje = capacidad == 0 ? 0 :
                (asientosOcupados * 100.0) / capacidad;
    }

    public String getRuta() { return ruta; }
    public LocalDate getFecha() { return fecha; }
    public LocalTime getHora() { return hora; }
    public String getUnidad() { return unidad; }
    public long getAsientosOcupados() { return asientosOcupados; }
    public int getCapacidad() { return capacidad; }
    public double getPorcentaje() { return porcentaje; }
}
