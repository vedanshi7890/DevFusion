package com.devfusion.backend.model;

import java.util.Map;

public record AssessmentRequest(
        Long userId,
        String skill,
        Map<Long, String> answers
) {
}