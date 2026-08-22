package com.devfusion.backend.model;

public record UserResponse(
        Long id,
        String name,
        String email,
        String role,
        String careerGoal
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCareerGoal()
        );
    }
}
