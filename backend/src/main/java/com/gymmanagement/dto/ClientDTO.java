package com.gymmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

public class ClientDTO {

    @Data
    public static class Request {
        @NotBlank(message = "El nombre es requerido")
        private String name;

        @NotBlank(message = "El apellido es requerido")
        private String lastName;

        @Email(message = "El correo no es válido")
        private String email;

        private String phone;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String lastName;
        private String email;
        private String phone;
        private LocalDateTime createdAt;
        private String membershipStatus;
    }
}
