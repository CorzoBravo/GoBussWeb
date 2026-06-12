package com.proyectogobuss.Entities.UsersEntities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "cedula")
public class Usuario {

    @Id
    @Column(length = 15)
    private String cedula;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(length = 20)
    private String celular;

    @Column(nullable = false, length = 100)
    private String correo;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}
