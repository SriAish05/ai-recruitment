package com.recruit.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}
