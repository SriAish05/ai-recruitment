package com.recruit.controller;

import com.recruit.dto.EvaluationDto;
import com.recruit.dto.InterviewEvaluationRequest;
import com.recruit.entity.Candidate;
import com.recruit.entity.Evaluation;
import com.recruit.entity.EvaluationStatus;
import com.recruit.entity.Job;
import com.recruit.repository.EvaluationRepository;
import com.recruit.service.EmailService;
import com.recruit.service.EvaluationMapper;
import com.recruit.service.InterviewEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewEvaluationService interviewEvaluationService;
    private final EvaluationRepository evaluationRepository;
    private final EmailService emailService;
    private final EvaluationMapper evaluationMapper;

    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationDto> evaluate(
            @RequestBody InterviewEvaluationRequest request) {
        return ResponseEntity.ok(
                interviewEvaluationService.evaluate(
                        request.getCandidateId(),
                        request.getJobId(),
                        request.getTranscript()
                )
        );
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<EvaluationDto> approve(@PathVariable Long id) {
        Evaluation evaluation = loadEvaluation(id);
        evaluation.setStatus(EvaluationStatus.APPROVED);
        return ResponseEntity.ok(evaluationMapper.toDto(evaluationRepository.save(evaluation)));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<EvaluationDto> reject(@PathVariable Long id) {
        Evaluation evaluation = loadEvaluation(id);
        evaluation.setStatus(EvaluationStatus.REJECTED);
        return ResponseEntity.ok(evaluationMapper.toDto(evaluationRepository.save(evaluation)));
    }

    @PostMapping("/{id}/send-invite")
    public ResponseEntity<Map<String, Object>> sendInvite(@PathVariable Long id) {
        Evaluation evaluation = loadEvaluation(id);
        if (evaluation.getStatus() != EvaluationStatus.APPROVED) {
            throw new RuntimeException("Evaluation must be approved before sending invite");
        }

        Candidate candidate = evaluation.getCandidate();
        Job job = evaluation.getJob();

        emailService.sendInterviewInvite(
                candidate.getEmail(),
                candidate.getName(),
                job.getTitle()
        );

        return ResponseEntity.ok(Map.of(
                "evaluationId", id,
                "sentAt", LocalDateTime.now().toString()
        ));
    }

    private Evaluation loadEvaluation(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation not found: " + id));
    }
}
