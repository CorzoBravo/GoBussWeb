package com.proyectogobuss.services;

import com.proyectogobuss.Entities.CoopEntities.Unidad;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.dto.unidad.UnidadCreateRequest;
import com.proyectogobuss.dto.unidad.UnidadDTO;
import com.proyectogobuss.dto.unidad.UnidadUpdateRequest;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.UnidadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UnidadService {

    private final UnidadRepository unidadRepository;
    private final CooperativaRepository cooperativaRepository;

    @Transactional(readOnly = true)
    public List<UnidadDTO> getByCooperativa(String ruc) {
        cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found: " + ruc));

        return unidadRepository.findByRuc(ruc)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UnidadDTO getById(Integer id) {
        Unidad unidad = unidadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidad not found: " + id));
        return convertToDTO(unidad);
    }

    public UnidadDTO create(String ruc, UnidadCreateRequest request) {
        Cooperativa coop = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found: " + ruc));

        // Validar que (ruc, numero) sean únicos
        var existing = unidadRepository.findByRucAndNumero(ruc, request.getNumero());
        if (existing.isPresent()) {
            throw new ResourceNotFoundException("Unidad with number " + request.getNumero() + " already exists");
        }

        Unidad unidad = new Unidad();
        unidad.setRuc(ruc);
        unidad.setNumero(request.getNumero());
        unidad.setPlaca(request.getPlaca());
        unidad.setModelo(request.getModelo());
        unidad.setCapacidad(request.getCapacidad());
        unidad.setFabricado(request.getFabricado());

        unidad = unidadRepository.save(unidad);
        log.info("Unidad created: {} for cooperativa {}", unidad.getIdUnidad(), ruc);

        return convertToDTO(unidad);
    }

    public UnidadDTO update(String ruc, Integer id, UnidadUpdateRequest request) {
        Unidad unidad = unidadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidad not found: " + id));

        if (!unidad.getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Unidad does not belong to this cooperativa");
        }

        unidad.setPlaca(request.getPlaca());
        unidad.setModelo(request.getModelo());
        unidad.setCapacidad(request.getCapacidad());
        unidad.setFabricado(request.getFabricado());

        unidad = unidadRepository.save(unidad);
        log.info("Unidad updated: {}", id);

        return convertToDTO(unidad);
    }

    public void delete(String ruc, Integer id) {
        Unidad unidad = unidadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidad not found: " + id));

        if (!unidad.getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Unidad does not belong to this cooperativa");
        }

        unidadRepository.delete(unidad);
        log.info("Unidad deleted: {}", id);
    }

    private UnidadDTO convertToDTO(Unidad unidad) {
        return UnidadDTO.builder()
                .idUnidad(unidad.getIdUnidad())
                .numero(unidad.getNumero())
                .placa(unidad.getPlaca())
                .modelo(unidad.getModelo())
                .capacidad(unidad.getCapacidad())
                .fabricado(unidad.getFabricado())
                .build();
    }
}
