package com.jobconnect.repository;

import com.jobconnect.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByJobSeekerIdOrderByUploadedAtDesc(Long jobSeekerId);
    Optional<Resume> findTopByJobSeekerIdOrderByUploadedAtDesc(Long jobSeekerId);
}

