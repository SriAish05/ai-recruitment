package com.recruit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDto {

    private Long resumeId;
    private Long candidateId;
    private String candidateEmail;
    private String jobTitle;
    private String extractedTextPreview;
}
