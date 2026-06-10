package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.RutaEntities.RutaFinal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutaFinalRepository extends JpaRepository<RutaFinal, Integer> {

    @Query("SELECT rf FROM RutaFinal rf WHERE rf.cooperativa.ruc = :ruc")
    List<RutaFinal> findByCooperativaRuc(@Param("ruc") String ruc);

    List<RutaFinal> findByRutaGeneralIdRutaGeneral(Integer idRutaGeneral);
}
