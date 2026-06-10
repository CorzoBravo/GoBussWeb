package com.proyectogobuss.services;

import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.dto.cooperativa.CooperativaCreateRequest;
import com.proyectogobuss.dto.cooperativa.CooperativaDTO;
import com.proyectogobuss.dto.cooperativa.CooperativaUpdateRequest;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.CooperativaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CooperativaService {

    private final CooperativaRepository cooperativaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<CooperativaDTO> getAll() {
        return cooperativaRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CooperativaDTO getById(String ruc) {
        Cooperativa cooperativa = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found with RUC: " + ruc));
        return convertToDTO(cooperativa);
    }

    @Transactional(readOnly = true)
    public List<CooperativaDTO> search(String searchTerm) {
        return cooperativaRepository.searchByNombreOrRuc(searchTerm)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public CooperativaDTO create(CooperativaCreateRequest request) {
        if (cooperativaRepository.existsByRuc(request.getRuc())) {
            throw new ResourceNotFoundException("Cooperativa already exists with RUC: " + request.getRuc());
        }

        Cooperativa cooperativa = new Cooperativa();
        cooperativa.setRuc(request.getRuc());
        cooperativa.setNombre(request.getNombre());
        cooperativa.setDireccion(request.getDireccion());
        cooperativa.setCorreo(request.getCorreo());
        cooperativa.setTelefono(request.getTelefono());
        cooperativa.setClave(passwordEncoder.encode(request.getClave()));

        cooperativa = cooperativaRepository.save(cooperativa);
        log.info("Cooperativa created: {}", cooperativa.getRuc());

        return convertToDTO(cooperativa);
    }

    public CooperativaDTO update(String ruc, CooperativaUpdateRequest request) {
        Cooperativa cooperativa = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found with RUC: " + ruc));

        if (request.getNombre() != null) {
            cooperativa.setNombre(request.getNombre());
        }
        if (request.getDireccion() != null) {
            cooperativa.setDireccion(request.getDireccion());
        }
        if (request.getCorreo() != null) {
            cooperativa.setCorreo(request.getCorreo());
        }
        if (request.getTelefono() != null) {
            cooperativa.setTelefono(request.getTelefono());
        }
        if (request.getClave() != null) {
            cooperativa.setClave(passwordEncoder.encode(request.getClave()));
        }

        cooperativa = cooperativaRepository.save(cooperativa);
        log.info("Cooperativa updated: {}", cooperativa.getRuc());

        return convertToDTO(cooperativa);
    }

    public void delete(String ruc) {
        Cooperativa cooperativa = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found with RUC: " + ruc));

        cooperativaRepository.delete(cooperativa);
        log.info("Cooperativa deleted: {}", ruc);
    }

    private CooperativaDTO convertToDTO(Cooperativa cooperativa) {
        return CooperativaDTO.builder()
                .ruc(cooperativa.getRuc())
                .nombre(cooperativa.getNombre())
                .direccion(cooperativa.getDireccion())
                .correo(cooperativa.getCorreo())
                .telefono(cooperativa.getTelefono())
                .build();
    }
}
