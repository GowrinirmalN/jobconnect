package com.jobconnect.repository;

import com.jobconnect.entity.Application;
import com.jobconnect.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByJobSeekerId(Long jobSeekerId, Pageable pageable);

    List<Application> findByJobSeekerId(Long jobSeekerId);

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    List<Application> findByJobId(Long jobId);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId " +
           "AND (:jobId IS NULL OR a.job.id = :jobId) " +
           "AND (:status IS NULL OR a.status = :status)")
    Page<Application> findRecruiterApplications(
            @Param("recruiterId") Long recruiterId,
            @Param("jobId") Long jobId,
            @Param("status") ApplicationStatus status,
            Pageable pageable
    );

    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    Optional<Application> findByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    long countByJobSeekerId(Long jobSeekerId);

    long countByJobSeekerIdAndStatus(Long jobSeekerId, ApplicationStatus status);

    long countByJobRecruiterId(Long recruiterId);

    long countByJobRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.id = :jobId")
    long countByJobId(@Param("jobId") Long jobId);
}

