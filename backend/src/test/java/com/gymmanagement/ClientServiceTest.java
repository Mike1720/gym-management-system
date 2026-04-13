package com.gymmanagement;

import com.gymmanagement.dto.ClientDTO;
import com.gymmanagement.service.ClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ClientServiceTest {

    @Autowired
    private ClientService clientService;

    private ClientDTO.Request buildRequest(String name, String lastName, String email) {
        ClientDTO.Request request = new ClientDTO.Request();
        request.setName(name);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setPhone("5551234567");
        return request;
    }

    @Test
    void testCrearCliente() {
        ClientDTO.Request request = buildRequest("Juan", "Pérez", "juan@test.com");
        ClientDTO.Response response = clientService.createClient(request);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("Juan", response.getName());
        assertEquals("Pérez", response.getLastName());
        assertEquals("SIN MEMBRESÍA", response.getMembershipStatus());
    }

    @Test
    void testObtenerTodosLosClientes() {
        clientService.createClient(buildRequest("Ana", "López", "ana@test.com"));
        clientService.createClient(buildRequest("Carlos", "Ruiz", "carlos@test.com"));

        List<ClientDTO.Response> clients = clientService.getAllClients();
        assertTrue(clients.size() >= 2);
    }

    @Test
    void testActualizarCliente() {
        ClientDTO.Response created = clientService.createClient(
                buildRequest("Maria", "García", "maria@test.com"));

        ClientDTO.Request updateRequest = buildRequest("Maria", "González", "maria@test.com");
        ClientDTO.Response updated = clientService.updateClient(created.getId(), updateRequest);

        assertEquals("González", updated.getLastName());
    }

    @Test
    void testEliminarCliente() {
        ClientDTO.Response created = clientService.createClient(
                buildRequest("Luis", "Herrera", "luis@test.com"));
        Long id = created.getId();

        clientService.deleteClient(id);

        assertThrows(RuntimeException.class, () -> clientService.getClientById(id));
    }

    @Test
    void testBuscarClientePorNombre() {
        clientService.createClient(buildRequest("Roberto", "Martínez", "roberto@test.com"));

        List<ClientDTO.Response> results = clientService.searchClients("roberto");
        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(c -> c.getName().equalsIgnoreCase("Roberto")));
    }

    @Test
    void testCorreoDuplicadoLanzaExcepcion() {
        clientService.createClient(buildRequest("Pedro", "Soto", "duplicado@test.com"));

        ClientDTO.Request duplicado = buildRequest("Otro", "Cliente", "duplicado@test.com");
        assertThrows(RuntimeException.class, () -> clientService.createClient(duplicado));
    }
}
