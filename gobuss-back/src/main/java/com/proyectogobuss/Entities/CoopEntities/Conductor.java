package com.proyectogobuss.Entities.CoopEntities;

import com.proyectogobuss.Entities.RutaEntities.RutaFinal;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "conductor")
public class Conductor {

    @Id
    private String cedula;

    private String nombre;

    private String celular;

    @ManyToOne
    @JoinColumn(name = "ruta_asignada", referencedColumnName = "idRutaFinal", nullable = true)
    private RutaFinal rutaAsignada;

    @ManyToOne
    @JoinColumn(name = "ruc_cooperativa", referencedColumnName = "ruc", nullable = false)
    private Cooperativa cooperativa;

    @ManyToOne
    @JoinColumn(name = "unidad_asignada", referencedColumnName = "idUnidad", nullable = true)
    private Unidad unidadAsignada;



    @Override
    public String toString() {
        return nombre + " (" + cedula + ")";
    }

    @Column(nullable = false)
    private boolean activo = true;
}

