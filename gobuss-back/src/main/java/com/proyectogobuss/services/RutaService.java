package com.proyectogobuss.services;

import com.proyectogobuss.Entities.RutaEntities.Ciudad;
import com.proyectogobuss.Entities.RutaEntities.RutaGeneral;
import com.proyectogobuss.Entities.RutaEntities.RutaFinal;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.dto.ruta.*;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.CiudadRepository;
import com.proyectogobuss.repositories.RutaGeneralRepository;
import com.proyectogobuss.repositories.RutaFinalRepository;
import com.proyectogobuss.repositories.CooperativaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RutaService {

    private final CiudadRepository ciudadRepository;
    private final RutaGeneralRepository rutaGeneralRepository;
    private final RutaFinalRepository rutaFinalRepository;
    private final CooperativaRepository cooperativaRepository;

    // CIUDADES
    @Transactional(readOnly = true)
    @Cacheable("ciudades")
    public List<CiudadDTO> getAllCiudades() {
        return ciudadRepository.findAll()
                .stream()
                .map(this::convertCiudadToDTO)
                .toList();
    }

    @CacheEvict(value = "ciudades", allEntries = true)
    public CiudadDTO createCiudad(CiudadCreateRequest request) {
        if (ciudadRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new ResourceNotFoundException("Ciudad already exists: " + request.getNombre());
        }

        Ciudad ciudad = new Ciudad();
        ciudad.setNombre(request.getNombre());
        ciudad = ciudadRepository.save(ciudad);

        log.info("Ciudad created: {}", ciudad.getNombre());
        return convertCiudadToDTO(ciudad);
    }

    @CacheEvict(value = "ciudades", allEntries = true)
    public void deleteCiudad(Integer id) {
        Ciudad ciudad = ciudadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad not found: " + id));
        ciudadRepository.delete(ciudad);
        log.info("Ciudad deleted: {}", id);
    }

    // RUTAS GENERALES
    @Transactional(readOnly = true)
    @Cacheable("rutas_generales")
    public List<RutaGeneralDTO> getAllRutasGenerales() {
        return rutaGeneralRepository.findAll()
                .stream()
                .map(this::convertRutaGeneralToDTO)
                .toList();
    }

    @CacheEvict(value = "rutas_generales", allEntries = true)
    public RutaGeneralDTO createRutaGeneral(RutaGeneralCreateRequest request) {
        Ciudad origen = ciudadRepository.findById(request.getOrigenId())
                .orElseThrow(() -> new ResourceNotFoundException("Origen ciudad not found"));
        Ciudad destino = ciudadRepository.findById(request.getDestinoId())
                .orElseThrow(() -> new ResourceNotFoundException("Destino ciudad not found"));

        RutaGeneral ruta = new RutaGeneral();
        ruta.setOrigen(origen);
        ruta.setDestino(destino);
        ruta = rutaGeneralRepository.save(ruta);

        log.info("RutaGeneral created: {} → {}", origen.getNombre(), destino.getNombre());
        return convertRutaGeneralToDTO(ruta);
    }

    // RUTAS FINALES
    @Transactional(readOnly = true)
    public List<RutaFinalDTO> getRutasByCooperativa(String ruc) {
        Cooperativa coop = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found: " + ruc));

        return rutaFinalRepository.findByCooperativaRuc(ruc)
                .stream()
                .map(this::convertRutaFinalToDTO)
                .toList();
    }

    public RutaFinalDTO addRutaToCooperativa(String ruc, RutaFinalCreateRequest request) {
        Cooperativa coop = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found: " + ruc));

        RutaGeneral rutaGeneral = rutaGeneralRepository.findById(request.getRutaGeneralId())
                .orElseThrow(() -> new ResourceNotFoundException("Ruta general not found"));

        RutaFinal rutaFinal = new RutaFinal();
        rutaFinal.setCooperativa(coop);
        rutaFinal.setRutaGeneral(rutaGeneral);
        rutaFinal.setPrecio(request.getPrecio());
        rutaFinal = rutaFinalRepository.save(rutaFinal);

        log.info("Ruta added to cooperativa: {}", ruc);
        return convertRutaFinalToDTO(rutaFinal);
    }

    public RutaFinalDTO updateRutaFinal(String ruc, Integer rutaId, RutaFinalUpdateRequest request) {
        RutaFinal ruta = rutaFinalRepository.findById(rutaId)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta final not found"));

        if (!ruta.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Ruta does not belong to this cooperativa");
        }

        if (request.getPrecio() != null) {
            ruta.setPrecio(request.getPrecio());
        }

        ruta = rutaFinalRepository.save(ruta);
        log.info("Ruta final updated: {}", rutaId);
        return convertRutaFinalToDTO(ruta);
    }

    public void deleteRutaFinal(String ruc, Integer rutaId) {
        RutaFinal ruta = rutaFinalRepository.findById(rutaId)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta final not found"));

        if (!ruta.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Ruta does not belong to this cooperativa");
        }

        rutaFinalRepository.delete(ruta);
        log.info("Ruta final deleted: {}", rutaId);
    }

    // CONVERTERS
    private CiudadDTO convertCiudadToDTO(Ciudad ciudad) {
        return CiudadDTO.builder()
                .id(ciudad.getId())
                .nombre(ciudad.getNombre())
                .build();
    }

    private RutaGeneralDTO convertRutaGeneralToDTO(RutaGeneral ruta) {
        return RutaGeneralDTO.builder()
                .id(ruta.getIdRutaGeneral())
                .origen(convertCiudadToDTO(ruta.getOrigen()))
                .destino(convertCiudadToDTO(ruta.getDestino()))
                .build();
    }

    private RutaFinalDTO convertRutaFinalToDTO(RutaFinal ruta) {
        return RutaFinalDTO.builder()
                .id(ruta.getIdRutaFinal())
                .rutaGeneral(convertRutaGeneralToDTO(ruta.getRutaGeneral()))
                .precio(ruta.getPrecio())
                .build();
    }
}

