package com.proyectogobuss.services;

import com.proyectogobuss.Entities.RutaEntities.Ciudad;
import com.proyectogobuss.dto.ruta.CiudadDTO;
import com.proyectogobuss.repositories.CiudadRepository;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.RutaFinalRepository;
import com.proyectogobuss.repositories.RutaGeneralRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RutaServiceTest {

    @Mock
    private CiudadRepository ciudadRepository;
    @Mock
    private RutaGeneralRepository rutaGeneralRepository;
    @Mock
    private RutaFinalRepository rutaFinalRepository;
    @Mock
    private CooperativaRepository cooperativaRepository;

    @InjectMocks
    private RutaService rutaService;

    @Test
    void testGetAllCiudades() {
        Ciudad c1 = new Ciudad();
        c1.setId(1);
        c1.setNombre("Quito");
        
        Ciudad c2 = new Ciudad();
        c2.setId(2);
        c2.setNombre("Guayaquil");

        when(ciudadRepository.findAll()).thenReturn(Arrays.asList(c1, c2));

        List<CiudadDTO> result = rutaService.getAllCiudades();

        assertEquals(2, result.size());
        assertEquals("Quito", result.get(0).getNombre());
        assertEquals("Guayaquil", result.get(1).getNombre());
    }
}
