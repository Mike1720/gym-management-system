package com.gymmanagement.service;

import com.gymmanagement.dto.MembershipDTO;
import com.gymmanagement.entity.Client;
import com.gymmanagement.entity.Membership;
import com.gymmanagement.repository.ClientRepository;
import com.gymmanagement.repository.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private ClientRepository clientRepository;

    public MembershipDTO.Response createMembership(MembershipDTO.Request request) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + request.getClientId()));

        LocalDate endDate = calculateEndDate(request.getStartDate(), request.getType());

        Membership membership = Membership.builder()
                .client(client)
                .startDate(request.getStartDate())
                .endDate(endDate)
                .amount(request.getAmount())
                .type(request.getType())
                .build();

        return toResponse(membershipRepository.save(membership));
    }

    public List<MembershipDTO.Response> getMembershipsByClient(Long clientId) {
        return membershipRepository.findByClientId(clientId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MembershipDTO.Response> getAllMemberships() {
        return membershipRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MembershipDTO.Response> getActiveMemberships() {
        return membershipRepository.findActiveMemberships(LocalDate.now()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MembershipDTO.Response> getExpiredMemberships() {
        return membershipRepository.findExpiredMemberships(LocalDate.now()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MembershipDTO.Response getMembershipById(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membresía no encontrada con id: " + id));
        return toResponse(membership);
    }

    public void deleteMembership(Long id) {
        if (!membershipRepository.existsById(id)) {
            throw new RuntimeException("Membresía no encontrada con id: " + id);
        }
        membershipRepository.deleteById(id);
    }

    private LocalDate calculateEndDate(LocalDate startDate, Membership.MembershipType type) {
        return switch (type) {
            case MENSUAL -> startDate.plusMonths(1);
            case TRIMESTRAL -> startDate.plusMonths(3);
            case SEMESTRAL -> startDate.plusMonths(6);
            case ANUAL -> startDate.plusYears(1);
        };
    }

    private MembershipDTO.Response toResponse(Membership membership) {
        MembershipDTO.Response response = new MembershipDTO.Response();
        response.setId(membership.getId());
        response.setClientId(membership.getClient().getId());
        response.setClientName(membership.getClient().getName() + " " + membership.getClient().getLastName());
        response.setStartDate(membership.getStartDate());
        response.setEndDate(membership.getEndDate());
        response.setAmount(membership.getAmount());
        response.setType(membership.getType());
        response.setPaymentDate(membership.getPaymentDate());
        response.setActive(membership.isActive());
        response.setStatus(membership.isActive() ? "ACTIVA" : "VENCIDA");
        return response;
    }
}
