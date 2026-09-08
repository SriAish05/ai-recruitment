package com.recruit.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationDto {

    private Long id;
    private Long candidateId;
    private Long jobId;
    private String stage;
    private Double matchScore;
    private String recommendation;
    private String rationale;
    private String status;
    private LocalDateTime createdAt;
}
