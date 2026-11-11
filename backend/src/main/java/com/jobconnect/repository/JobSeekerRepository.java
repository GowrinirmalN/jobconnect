package com.jobconnect.repository;

import com.jobconnect.entity.JobSeeker;
import com.jobconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {
    Optional<JobSeeker> findByUser(User user);
    Optional<JobSeeker> findByUserId(Long userId);
    Optional<JobSeeker> findByUserEmail(String email);
}

