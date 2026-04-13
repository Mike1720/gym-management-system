package com.gymmanagement.service;

import com.gymmanagement.dto.ClientDTO;
import com.gymmanagement.entity.Client;
import com.gymmanagement.entity.Membership;
import com.gymmanagement.repository.ClientRepository;
import com.gymmanagement.repository.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    public List<ClientDTO.Response> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClientDTO.Response getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        return toResponse(client);
    }

    public List<ClientDTO.Response> searchClients(String query) {
        return clientRepository
                .findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClientDTO.Response createClient(ClientDTO.Request request) {
        if (request.getEmail() != null && clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un cliente con ese correo electrónico");
        }

        Client client = Client.builder()
                .name(request.getName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        return toResponse(clientRepository.save(client));
    }

    public ClientDTO.Response updateClient(Long id, ClientDTO.Request request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));

        client.setName(request.getName());
        client.setLastName(request.getLastName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());

        return toResponse(clientRepository.save(client));
    }

    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado con id: " + id);
        }
        clientRepository.deleteById(id);
    }

    private ClientDTO.Response toResponse(Client client) {
        ClientDTO.Response response = new ClientDTO.Response();
        response.setId(client.getId());
        response.setName(client.getName());
        response.setLastName(client.getLastName());
        response.setEmail(client.getEmail());
        response.setPhone(client.getPhone());
        response.setCreatedAt(client.getCreatedAt());

        Optional<Membership> latest = membershipRepository.findLatestByClientId(client.getId());
        if (latest.isPresent()) {
            response.setMembershipStatus(latest.get().isActive() ? "ACTIVA" : "VENCIDA");
        } else {
            response.setMembershipStatus("SIN MEMBRESÍA");
        }

        return response;
    }
}
