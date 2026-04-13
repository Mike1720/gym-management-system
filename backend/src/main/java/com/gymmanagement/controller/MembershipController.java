package com.gymmanagement.controller;

import com.gymmanagement.dto.MembershipDTO;
import com.gymmanagement.service.MembershipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @GetMapping
    public ResponseEntity<List<MembershipDTO.Response>> getAllMemberships(
            @RequestParam(required = false) String status) {
        if ("activa".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(membershipService.getActiveMemberships());
        } else if ("vencida".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(membershipService.getExpiredMemberships());
        }
        return ResponseEntity.ok(membershipService.getAllMemberships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipDTO.Response> getMembershipById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(membershipService.getMembershipById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<MembershipDTO.Response>> getMembershipsByClient(
            @PathVariable Long clientId) {
        return ResponseEntity.ok(membershipService.getMembershipsByClient(clientId));
    }

    @PostMapping
    public ResponseEntity<?> createMembership(@Valid @RequestBody MembershipDTO.Request request) {
        try {
            MembershipDTO.Response response = membershipService.createMembership(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMembership(@PathVariable Long id) {
        try {
            membershipService.deleteMembership(id);
            return ResponseEntity.ok("Membresía eliminada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
