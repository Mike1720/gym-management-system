package com.gymmanagement.repository;

import com.gymmanagement.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    List<Membership> findByClientId(Long clientId);

    @Query("SELECT m FROM Membership m WHERE m.client.id = :clientId ORDER BY m.endDate DESC")
    Optional<Membership> findLatestByClientId(Long clientId);

    @Query("SELECT m FROM Membership m WHERE m.endDate < :today")
    List<Membership> findExpiredMemberships(LocalDate today);

    @Query("SELECT m FROM Membership m WHERE m.endDate >= :today")
    List<Membership> findActiveMemberships(LocalDate today);
}
