package com.recruit.repository;

import com.recruit.entity.Evaluation;
import com.recruit.entity.EvaluationStatus;
import com.recruit.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    List<Evaluation> findByCandidateId(Long candidateId);

    List<Evaluation> findByJobId(Long jobId);

    List<Evaluation> findByStatus(EvaluationStatus status);

    List<Evaluation> findByCandidateIdAndJobIdAndStage(Long candidateId,
                                                         Long jobId,
                                                         Stage stage);
}
