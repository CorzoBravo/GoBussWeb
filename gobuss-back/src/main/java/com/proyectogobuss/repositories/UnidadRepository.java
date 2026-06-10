package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.CoopEntities.Unidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnidadRepository extends JpaRepository<Unidad, Integer> {

    @Query("SELECT u FROM Unidad u WHERE u.ruc = :ruc")
    List<Unidad> findByRuc(@Param("ruc") String ruc);

    @Query("SELECT u FROM Unidad u WHERE u.ruc = :ruc AND u.numero = :numero")
    java.util.Optional<Unidad> findByRucAndNumero(@Param("ruc") String ruc, @Param("numero") int numero);

    @Query("SELECT u FROM Unidad u WHERE u.placa = :placa")
    java.util.Optional<Unidad> findByPlaca(@Param("placa") String placa);
}
