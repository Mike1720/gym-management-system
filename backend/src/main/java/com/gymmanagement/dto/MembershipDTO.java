package com.gymmanagement.dto;

import com.gymmanagement.entity.Membership;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MembershipDTO {

    @Data
    public static class Request {
        @NotNull(message = "El cliente es requerido")
        private Long clientId;

        @NotNull(message = "La fecha de inicio es requerida")
        private LocalDate startDate;

        @NotNull(message = "El tipo de membresía es requerido")
        private Membership.MembershipType type;

        @NotNull(message = "El monto es requerido")
        @Positive(message = "El monto debe ser positivo")
        private BigDecimal amount;
    }

    @Data
    public static class Response {
        private Long id;
        private Long clientId;
        private String clientName;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal amount;
        private Membership.MembershipType type;
        private LocalDateTime paymentDate;
        private boolean active;
        private String status;
    }
}
