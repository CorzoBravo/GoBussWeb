package com.proyectogobuss.Entities.RutaEntities;

import com.proyectogobuss.Entities.UsersEntities.Cooperativa;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "ruta_final")
public class RutaFinal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRutaFinal;

    @ManyToOne
    @JoinColumn(name = "id_ruta_general", nullable = false)
    private RutaGeneral rutaGeneral;

    @ManyToOne
    @JoinColumn(name = "ruc", referencedColumnName = "ruc", nullable = false)
    private Cooperativa cooperativa;

    @Column(nullable = false)
    private double precio;



    public RutaFinal(RutaGeneral rutaGeneral, Cooperativa cooperativa) {
        this.rutaGeneral = rutaGeneral;
        this.cooperativa = cooperativa;
    }

    @Override
    public String toString() {
        if (rutaGeneral != null &&
                rutaGeneral.getOrigen() != null &&
                rutaGeneral.getDestino() != null) {

            return rutaGeneral.getOrigen().getNombre()
                    + " â†’ " +
                    rutaGeneral.getDestino().getNombre();
        }
        return "Ruta Final " + idRutaFinal;
    }

    @Column(nullable = false)
    private boolean activo = true;
}

