package com.recruit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewEvaluationRequest {

    private Long candidateId;
    private Long jobId;
    private String transcript;
}
