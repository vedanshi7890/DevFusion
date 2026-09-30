package com.devfusion.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_attempts")
public class AssessmentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String skill;

    private int score;

    private int correctAnswers;

    private int totalQuestions;

    private LocalDateTime attemptedAt;

    public AssessmentAttempt() {
    }

    public AssessmentAttempt(
            Long userId,
            String skill,
            int score,
            int correctAnswers,
            int totalQuestions) {

        this.userId = userId;
        this.skill = skill;
        this.score = score;
        this.correctAnswers = correctAnswers;
        this.totalQuestions = totalQuestions;
        this.attemptedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getSkill() {
        return skill;
    }

    public int getScore() {
        return score;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }
}