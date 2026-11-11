package com.jobconnect.repository;

import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByRecruiterId(Long recruiterId, Pageable pageable);

    List<Job> findByRecruiterId(Long recruiterId);

    long countByStatus(JobStatus status);

    long countByRecruiterId(Long recruiterId);

    @Query("SELECT j FROM Job j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "  OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "  OR LOWER(j.skillsRequired) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "  OR LOWER(j.recruiter.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:minSalary IS NULL OR (j.salaryMax IS NOT NULL AND j.salaryMax >= :minSalary) OR (j.salaryMin IS NOT NULL AND j.salaryMin >= :minSalary)) AND " +
           "(:maxSalary IS NULL OR (j.salaryMin IS NOT NULL AND j.salaryMin <= :maxSalary))")
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("jobType") JobType jobType,
            @Param("minSalary") BigDecimal minSalary,
            @Param("maxSalary") BigDecimal maxSalary,
            @Param("status") JobStatus status,
            Pageable pageable
    );

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' ORDER BY j.createdAt DESC")
    List<Job> findTop6RecentJobs();
}

