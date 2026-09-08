package com.recruit.service;

import com.recruit.config.AiClient;
import com.recruit.dto.EvaluationDto;
import com.recruit.entity.*;
import com.recruit.repository.EvaluationRepository;
import com.recruit.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ScreeningService {

    private final ResumeRepository resumeRepository;
    private final EvaluationRepository evaluationRepository;
    private final AiClient aiClient;

    public EvaluationDto runScreening(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found: " + resumeId));

        Job job = resume.getJob();

        Map<String, Object> aiResponse = aiClient.screenResume(
                job.getDescription(),
                resume.getRawText()
        );

        double matchScore = ((Number) aiResponse.get("match_score")).doubleValue();
        Recommendation recommendation = Recommendation.valueOf(
                (String) aiResponse.get("recommendation"));
        String rationale = (String) aiResponse.get("rationale");

        Evaluation saved = evaluationRepository.save(
                Evaluation.builder()
                        .candidate(resume.getCandidate())
                        .job(job)
                        .stage(Stage.SCREENING)
                        .matchScore(matchScore)
                        .recommendation(recommendation)
                        .rationale(rationale)
                        .build()
        );

        return toDto(saved);
    }

    private EvaluationDto toDto(Evaluation e) {
        return EvaluationDto.builder()
                .id(e.getId())
                .candidateId(e.getCandidate().getId())
                .jobId(e.getJob().getId())
                .stage(e.getStage().name())
                .matchScore(e.getMatchScore())
                .recommendation(e.getRecommendation().name())
                .rationale(e.getRationale())
                .status(e.getStatus().name())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
