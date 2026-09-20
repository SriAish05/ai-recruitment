-- V1: Initial schema for AI Recruitment Management System
-- Tables: users, jobs, candidates, resumes, evaluations

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    username      VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    created_at    DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS jobs (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at  DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS candidates (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    created_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_candidates_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resumes (
    id           BIGINT NOT NULL AUTO_INCREMENT,
    candidate_id BIGINT NOT NULL,
    job_id       BIGINT NOT NULL,
    raw_text     LONGTEXT,
    file_path    VARCHAR(500),
    uploaded_at  DATETIME(6),
    PRIMARY KEY (id),
    KEY idx_resumes_candidate_job (candidate_id, job_id),
    CONSTRAINT fk_resumes_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (id),
    CONSTRAINT fk_resumes_job       FOREIGN KEY (job_id)       REFERENCES jobs (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS evaluations (
    id           BIGINT NOT NULL AUTO_INCREMENT,
    candidate_id BIGINT      NOT NULL,
    job_id       BIGINT      NOT NULL,
    stage        VARCHAR(20) NOT NULL,
    match_score  DOUBLE,
    recommendation VARCHAR(20),
    rationale    TEXT,
    questions    LONGTEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at   DATETIME(6),
    PRIMARY KEY (id),
    KEY idx_evaluations_candidate_job_stage (candidate_id, job_id, stage),
    KEY idx_evaluations_status              (status),
    CONSTRAINT fk_evaluations_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (id),
    CONSTRAINT fk_evaluations_job       FOREIGN KEY (job_id)       REFERENCES jobs (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
