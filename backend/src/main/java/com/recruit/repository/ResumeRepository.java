package com.recruit.repository;

import com.recruit.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByCandidateId(Long candidateId);

    List<Resume> findByJobId(Long jobId);

    List<Resume> findByCandidateIdAndJobId(Long candidateId, Long jobId);
}
