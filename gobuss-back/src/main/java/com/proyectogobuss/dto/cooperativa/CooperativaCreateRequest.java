package com.proyectogobuss.dto.cooperativa;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CooperativaCreateRequest {

    @NotBlank(message = "RUC is required")
    @Size(min = 3, max = 20, message = "RUC must be between 3 and 20 characters")
    private String ruc;

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String nombre;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 100, message = "Address must be between 5 and 100 characters")
    private String direccion;

    @Email(message = "Email should be valid")
    private String correo;

    @Size(max = 20, message = "Phone must be maximum 20 characters")
    private String telefono;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 255, message = "Password must be between 6 and 255 characters")
    private String clave;
}
