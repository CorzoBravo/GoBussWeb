package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.CoopEntities.Ayudante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AyudanteRepository extends JpaRepository<Ayudante, String> {

    Optional<Ayudante> findByCedula(String cedula);

    java.util.List<Ayudante> findByCooperativaRuc(String ruc);
}
