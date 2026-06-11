package com.proyectogobuss.dto.cooperativa;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CooperativaUpdateRequest {

    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    @NotBlank
    private String nombre;

    @Size(min = 5, max = 100, message = "Address must be between 5 and 100 characters")
    @NotBlank
    private String direccion;

    @Email(message = "Email should be valid")
    @NotBlank
    private String correo;

    @Size(max = 20, message = "Phone must be maximum 20 characters")
    @NotBlank
    private String telefono;

    @Size(min = 6, max = 255, message = "Password must be between 6 and 255 characters")
    @NotBlank
    private String clave;
}
