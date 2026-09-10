package com.recruit.service;

import com.recruit.dto.EvaluationDto;
import com.recruit.entity.Evaluation;
import org.springframework.stereotype.Component;

@Component
public class EvaluationMapper {

    public EvaluationDto toDto(Evaluation e) {
        return EvaluationDto.builder()
                .id(e.getId())
                .candidateId(e.getCandidate().getId())
                .candidateName(e.getCandidate().getName())
                .jobId(e.getJob().getId())
                .jobTitle(e.getJob().getTitle())
                .stage(e.getStage().name())
                .matchScore(e.getMatchScore())
                .recommendation(e.getRecommendation() != null ? e.getRecommendation().name() : null)
                .rationale(e.getRationale())
                .questions(e.getQuestions())
                .status(e.getStatus().name())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
