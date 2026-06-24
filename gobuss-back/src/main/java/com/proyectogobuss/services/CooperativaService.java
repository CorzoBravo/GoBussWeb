package com.proyectogobuss.services;

import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.Entities.UsersEntities.Role;
import com.proyectogobuss.Entities.UsersEntities.User;
import com.proyectogobuss.dto.cooperativa.CooperativaCreateRequest;
import com.proyectogobuss.dto.cooperativa.CooperativaDTO;
import com.proyectogobuss.dto.cooperativa.CooperativaUpdateRequest;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CooperativaService {

    private final CooperativaRepository cooperativaRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<CooperativaDTO> getAll(Pageable pageable) {
        return cooperativaRepository.findByActivoTrue(pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public CooperativaDTO getById(String ruc) {
        Cooperativa cooperativa = cooperativaRepository.findByRucAndActivoTrue(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found or inactive with RUC: " + ruc));
        return convertToDTO(cooperativa);
    }

    @Transactional(readOnly = true)
    public Page<CooperativaDTO> search(String searchTerm, Pageable pageable) {
        return cooperativaRepository.searchByNombreOrRucAndActivoTrue(searchTerm, pageable)
                .map(this::convertToDTO);
    }

    public CooperativaDTO create(CooperativaCreateRequest request) {
        if (cooperativaRepository.existsByRuc(request.getRuc())) {
            throw new ResourceNotFoundException("Cooperativa already exists with RUC: " + request.getRuc());
        }

        // Create Auth User
        User user = new User();
        user.setUsername(request.getRuc());
        user.setPassword(passwordEncoder.encode(request.getClave()));
        user.setRole(Role.COOPERATIVA);
        user.setActivo(true);
        userRepository.save(user);

        // Create Profile
        Cooperativa cooperativa = new Cooperativa();
        cooperativa.setRuc(request.getRuc());
        cooperativa.setNombre(request.getNombre());
        cooperativa.setDireccion(request.getDireccion());
        cooperativa.setCorreo(request.getCorreo());
        cooperativa.setTelefono(request.getTelefono());
        cooperativa.setActivo(true);

        cooperativa = cooperativaRepository.save(cooperativa);
        log.info("Cooperativa created: {}", cooperativa.getRuc());

        return convertToDTO(cooperativa);
    }

    public CooperativaDTO update(String ruc, CooperativaUpdateRequest request, String authenticatedUsername) {
        boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !authenticatedUsername.equals(ruc)) {
            throw new com.proyectogobuss.exception.UnauthorizedException("No puedes editar otra cooperativa");
        }

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
            User user = userRepository.findByUsername(ruc).orElseThrow();
            user.setPassword(passwordEncoder.encode(request.getClave()));
            userRepository.save(user);
        }

        cooperativa = cooperativaRepository.save(cooperativa);
        log.info("Cooperativa updated: {}", cooperativa.getRuc());

        return convertToDTO(cooperativa);
    }

    public void delete(String ruc) {
        Cooperativa cooperativa = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found with RUC: " + ruc));

        cooperativa.setActivo(false);
        cooperativaRepository.save(cooperativa);

        userRepository.findByUsername(ruc).ifPresent(user -> {
            user.setActivo(false);
            userRepository.save(user);
        });

        log.info("Cooperativa logically deleted: {}", ruc);
    }

    public CooperativaDTO aprobar(String ruc) {
        Cooperativa cooperativa = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found"));
        cooperativa.setEstado(Cooperativa.EstadoCooperativa.APROBADA);
        return convertToDTO(cooperativaRepository.save(cooperativa));
    }

    public CooperativaDTO rechazar(String ruc) {
        Cooperativa cooperativa = cooperativaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found"));
        cooperativa.setEstado(Cooperativa.EstadoCooperativa.RECHAZADA);
        return convertToDTO(cooperativaRepository.save(cooperativa));
    }

    private CooperativaDTO convertToDTO(Cooperativa cooperativa) {
        return CooperativaDTO.builder()
                .ruc(cooperativa.getRuc())
                .nombre(cooperativa.getNombre())
                .direccion(cooperativa.getDireccion())
                .correo(cooperativa.getCorreo())
                .telefono(cooperativa.getTelefono())
                .estado(cooperativa.getEstado() != null ? cooperativa.getEstado().name() : "PENDIENTE")
                .build();
    }
}
