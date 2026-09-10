package com.recruit.controller;

import com.recruit.dto.StatsDto;
import com.recruit.entity.EvaluationStatus;
import com.recruit.repository.CandidateRepository;
import com.recruit.repository.EvaluationRepository;
import com.recruit.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final EvaluationRepository evaluationRepository;

    @GetMapping("/stats")
    public ResponseEntity<StatsDto> getStats() {
        return ResponseEntity.ok(new StatsDto(
                jobRepository.count(),
                candidateRepository.count(),
                evaluationRepository.countByStatus(EvaluationStatus.PENDING)
        ));
    }
}
