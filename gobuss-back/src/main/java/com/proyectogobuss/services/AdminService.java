package com.proyectogobuss.services;

import com.proyectogobuss.dto.admin.AdminDashboardDTO;
import com.proyectogobuss.repositories.BoletoRepository;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final CooperativaRepository cooperativaRepository;
    private final UsuarioRepository usuarioRepository;
    private final BoletoRepository boletoRepository;

    public AdminDashboardDTO getDashboardStats() {
        long totalCooperativas = cooperativaRepository.count();
        long totalUsuarios = usuarioRepository.count();
        long totalViajes = 0; // Will be implemented with viajes count
        double totalVentas = 0; // Will be implemented with boletos sum
        int capacidadPromedio = 0; // Will be implemented with average capacity

        return AdminDashboardDTO.builder()
                .totalCooperativas(totalCooperativas)
                .totalUsuarios(totalUsuarios)
                .totalViajes(totalViajes)
                .totalVentas(totalVentas)
                .capacidadPromedio(capacidadPromedio)
                .build();
    }
}
