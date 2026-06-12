package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CooperativaRepository extends JpaRepository<Cooperativa, String> {

    Optional<Cooperativa> findByRuc(String ruc);

    Optional<Cooperativa> findByRucAndActivoTrue(String ruc);

    Page<Cooperativa> findByActivoTrue(Pageable pageable);

    Optional<Cooperativa> findByCorreo(String correo);

    List<Cooperativa> findByNombreContainingIgnoreCase(String nombre);

    @Query("SELECT c FROM Cooperativa c WHERE " +
           "(LOWER(c.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.ruc) LIKE LOWER(CONCAT('%', :search, '%'))) AND c.activo = true")
    Page<Cooperativa> searchByNombreOrRucAndActivoTrue(@Param("search") String search, Pageable pageable);

    boolean existsByRuc(String ruc);

    boolean existsByCorreo(String correo);
}
