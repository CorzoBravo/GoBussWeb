package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.CoopEntities.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, String> {

    Optional<Conductor> findByCedula(String cedula);

    @Query("SELECT c FROM Conductor c WHERE c.cooperativa.ruc = :ruc")
    List<Conductor> findByCooperativaRuc(@Param("ruc") String ruc);

    List<Conductor> findByCooperativaNombreContainingIgnoreCase(String nombre);
}
