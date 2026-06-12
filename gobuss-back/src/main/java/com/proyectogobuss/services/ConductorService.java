package com.proyectogobuss.services;

import com.proyectogobuss.Entities.CoopEntities.Conductor;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.dto.conductor.ConductorCreateRequest;
import com.proyectogobuss.dto.conductor.ConductorDTO;
import com.proyectogobuss.dto.conductor.ConductorUpdateRequest;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.ConductorRepository;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.RutaFinalRepository;
import com.proyectogobuss.repositories.UnidadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConductorService {

    private final ConductorRepository conductorRepository;
    private final CooperativaRepository cooperativaRepository;
    private final com.proyectogobuss.repositories.RutaFinalRepository rutaFinalRepository;
    private final UnidadRepository unidadRepository;
    private final com.proyectogobuss.repositories.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<ConductorDTO> getByCooperativa(String ruc) {
        return conductorRepository.findByCooperativaRuc(ruc)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConductorDTO getById(String ruc, String cedula) {
        Conductor conductor = conductorRepository.findById(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("Conductor not found"));
        if (!conductor.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Conductor does not belong to cooperativa");
        }
        return convertToDTO(conductor);
    }

    @Transactional
    public ConductorDTO create(String ruc, ConductorCreateRequest request) {
        Cooperativa coop = cooperativaRepository.findById(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found"));

        if (conductorRepository.existsById(request.getCedula())) {
            throw new IllegalArgumentException("Conductor already exists");
        }

        Conductor conductor = new Conductor();
        conductor.setCedula(request.getCedula());
        conductor.setNombre(request.getNombre());
        conductor.setCelular(request.getCelular());
        conductor.setCooperativa(coop);

        if (request.getIdRutaAsignada() != null) {
            conductor.setRutaAsignada(rutaFinalRepository.findById(request.getIdRutaAsignada()).orElse(null));
        }
        if (request.getIdUnidadAsignada() != null) {
            conductor.setUnidadAsignada(unidadRepository.findById(request.getIdUnidadAsignada()).orElse(null));
        }

        // Crear usuario para que pueda iniciar sesión
        if (!userRepository.existsByUsername(request.getCedula())) {
            com.proyectogobuss.Entities.UsersEntities.User authUser = new com.proyectogobuss.Entities.UsersEntities.User();
            authUser.setUsername(request.getCedula());
            authUser.setPassword(passwordEncoder.encode(request.getCedula()));
            authUser.setRole(com.proyectogobuss.Entities.UsersEntities.Role.CONDUCTOR);
            authUser.setNombre(request.getNombre());
            authUser.setActivo(true);
            userRepository.save(authUser);
        }

        return convertToDTO(conductorRepository.save(conductor));
    }

    @Transactional
    public ConductorDTO update(String ruc, String cedula, ConductorUpdateRequest request) {
        Conductor conductor = conductorRepository.findById(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("Conductor not found"));
        if (!conductor.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Conductor does not belong to cooperativa");
        }

        if (request.getNombre() != null) conductor.setNombre(request.getNombre());
        if (request.getCelular() != null) conductor.setCelular(request.getCelular());

        if (request.getIdRutaAsignada() != null) {
            conductor.setRutaAsignada(rutaFinalRepository.findById(request.getIdRutaAsignada()).orElse(null));
        }
        if (request.getIdUnidadAsignada() != null) {
            conductor.setUnidadAsignada(unidadRepository.findById(request.getIdUnidadAsignada()).orElse(null));
        }

        return convertToDTO(conductorRepository.save(conductor));
    }

    @Transactional
    public void delete(String ruc, String cedula) {
        Conductor conductor = conductorRepository.findById(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("Conductor not found"));
        if (!conductor.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Conductor does not belong to cooperativa");
        }
        conductorRepository.delete(conductor);
    }

    private ConductorDTO convertToDTO(Conductor conductor) {
        return ConductorDTO.builder()
                .cedula(conductor.getCedula())
                .nombre(conductor.getNombre())
                .celular(conductor.getCelular())
                .rucCooperativa(conductor.getCooperativa() != null ? conductor.getCooperativa().getRuc() : null)
                .idRutaAsignada(conductor.getRutaAsignada() != null ? conductor.getRutaAsignada().getIdRutaFinal() : null)
                .idUnidadAsignada(conductor.getUnidadAsignada() != null ? conductor.getUnidadAsignada().getIdUnidad() : null)
                .build();
    }
}
