package com.gymmanagement.repository;

import com.gymmanagement.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String name, String lastName);
    boolean existsByEmail(String email);
}
