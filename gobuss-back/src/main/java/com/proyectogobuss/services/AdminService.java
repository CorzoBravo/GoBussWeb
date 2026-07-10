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

    public AdminDashboardDTO getDashboardStats(String ruc) {
        long totalCooperativas = ruc == null ? cooperativaRepository.count() : 0;
        long totalUsuarios = ruc == null ? usuarioRepository.count() : 0;
        long totalViajes = ruc == null ? boletoRepository.countViajesTotal() : boletoRepository.countViajesByCooperativa(ruc);
        double totalVentas = ruc == null ? boletoRepository.sumMontoTotal() : boletoRepository.sumMontoByCooperativa(ruc);
        int capacidadPromedio = 0; // Se puede implementar a futuro con avg capacidad de unidad

        return AdminDashboardDTO.builder()
                .totalCooperativas(totalCooperativas)
                .totalUsuarios(totalUsuarios)
                .totalViajes(totalViajes)
                .totalVentas(totalVentas)
                .capacidadPromedio(capacidadPromedio)
                .build();
    }
}
