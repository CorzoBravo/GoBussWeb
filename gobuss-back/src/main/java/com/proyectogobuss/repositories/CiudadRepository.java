package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.RutaEntities.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CiudadRepository extends JpaRepository<Ciudad, Integer> {

    Optional<Ciudad> findByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);
}
