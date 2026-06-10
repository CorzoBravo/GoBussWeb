package com.proyectogobuss.Entities.RutaEntities;

import com.proyectogobuss.Entities.UsersEntities.Cooperativa;

import jakarta.persistence.*;

@Entity
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

    public RutaFinal() {
    }

    public RutaFinal(RutaGeneral rutaGeneral, Cooperativa cooperativa) {
        this.rutaGeneral = rutaGeneral;
        this.cooperativa = cooperativa;
    }

    public Integer getIdRutaFinal() {
        return idRutaFinal;
    }

    public void setIdRutaFinal(Integer idRutaFinal) {
        this.idRutaFinal = idRutaFinal;
    }

    public RutaGeneral getRutaGeneral() {
        return rutaGeneral;
    }

    public void setRutaGeneral(RutaGeneral rutaGeneral) {
        this.rutaGeneral = rutaGeneral;
    }

    public Cooperativa getCooperativa() {
        return cooperativa;
    }

    public void setCooperativa(Cooperativa cooperativa) {
        this.cooperativa = cooperativa;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    @Override
    public String toString() {
        if (rutaGeneral != null &&
                rutaGeneral.getOrigen() != null &&
                rutaGeneral.getDestino() != null) {

            return rutaGeneral.getOrigen().getNombre()
                    + " → " +
                    rutaGeneral.getDestino().getNombre();
        }
        return "Ruta Final " + idRutaFinal;
    }

}
