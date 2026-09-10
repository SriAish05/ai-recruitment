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
    private String candidateName;
    private Long jobId;
    private String jobTitle;
    private String stage;
    private Double matchScore;
    private String recommendation;
    private String rationale;
    private String questions;
    private String status;
    private LocalDateTime createdAt;
}
