package com.proyectogobuss.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "La cédula es requerida")
    @Size(min = 10, max = 15, message = "La cédula debe tener entre 10 y 15 caracteres")
    private String cedula;

    @NotBlank(message = "El nombre es requerido")
    private String nombres;

    @NotBlank(message = "El correo es requerido")
    @Email(message = "Formato de correo inválido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
}
