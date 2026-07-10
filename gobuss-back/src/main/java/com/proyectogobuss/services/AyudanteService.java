package com.proyectogobuss.services;

import com.proyectogobuss.Entities.CoopEntities.Ayudante;
import com.proyectogobuss.dto.ayudante.AyudanteCreateRequest;
import com.proyectogobuss.dto.ayudante.AyudanteDTO;
import com.proyectogobuss.dto.ayudante.AyudanteUpdateRequest;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.AyudanteRepository;
import com.proyectogobuss.repositories.ConductorRepository;
import com.proyectogobuss.repositories.CooperativaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AyudanteService {

    private final AyudanteRepository ayudanteRepository;
    private final ConductorRepository conductorRepository;
    private final CooperativaRepository cooperativaRepository;

    @Transactional(readOnly = true)
    public List<AyudanteDTO> getByCooperativa(String ruc) {
        return ayudanteRepository.findByCooperativaRuc(ruc)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public AyudanteDTO getById(String ruc, String cedula) {
        Ayudante ayudante = ayudanteRepository.findById(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("Ayudante not found"));
        if (!ayudante.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Ayudante does not belong to this cooperativa");
        }
        return convertToDTO(ayudante);
    }

    @Transactional
    public AyudanteDTO create(String ruc, AyudanteCreateRequest request) {
        if (ayudanteRepository.existsById(request.getCedula())) {
            throw new IllegalArgumentException("Ayudante already exists");
        }

        com.proyectogobuss.Entities.UsersEntities.Cooperativa coop = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found"));

        Ayudante ayudante = new Ayudante();
        ayudante.setCedula(request.getCedula());
        ayudante.setNombres(request.getNombres());
        ayudante.setCelular(request.getCelular());
        ayudante.setCooperativa(coop);

        if (request.getConductorAsignadoCedula() != null) {
            ayudante.setConductorAsignado(conductorRepository.findById(request.getConductorAsignadoCedula()).orElse(null));
        }

        return convertToDTO(ayudanteRepository.save(ayudante));
    }

    @Transactional
    public AyudanteDTO update(String ruc, String cedula, AyudanteUpdateRequest request) {
        Ayudante ayudante = ayudanteRepository.findById(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("Ayudante not found"));
        if (!ayudante.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Ayudante does not belong to this cooperativa");
        }

        if (request.getNombres() != null) ayudante.setNombres(request.getNombres());
        if (request.getCelular() != null) ayudante.setCelular(request.getCelular());

        if (request.getConductorAsignadoCedula() != null) {
            ayudante.setConductorAsignado(conductorRepository.findById(request.getConductorAsignadoCedula()).orElse(null));
        }

        return convertToDTO(ayudanteRepository.save(ayudante));
    }

    @Transactional
    public void delete(String ruc, String cedula) {
        Ayudante ayudante = ayudanteRepository.findById(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("Ayudante not found"));
        if (!ayudante.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Ayudante does not belong to this cooperativa");
        }
        ayudanteRepository.delete(ayudante);
    }

    private AyudanteDTO convertToDTO(Ayudante ayudante) {
        return AyudanteDTO.builder()
                .cedula(ayudante.getCedula())
                .nombres(ayudante.getNombres())
                .celular(ayudante.getCelular())
                .conductorAsignadoCedula(ayudante.getConductorAsignado() != null ? ayudante.getConductorAsignado().getCedula() : null)
                .build();
    }
}
