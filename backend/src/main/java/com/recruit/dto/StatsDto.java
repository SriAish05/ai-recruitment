package com.recruit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatsDto {

    private Long totalJobs;
    private Long totalCandidates;
    private Long pendingEvaluations;
}
