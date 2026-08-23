package com.devfusion.backend.model;

public record AssessmentResult(
        String skill,
        int totalQuestions,
        int correctAnswers,
        int score
) {
}