package com.devfusion.backend.model;

public record QuestionResponse(
        Long id,
        String skill,
        String question,
        String optionA,
        String optionB,
        String optionC,
        String optionD,
        String difficulty
) {

    public static QuestionResponse from(Question question) {

        return new QuestionResponse(
                question.getId(),
                question.getSkill(),
                question.getQuestion(),
                question.getOptionA(),
                question.getOptionB(),
                question.getOptionC(),
                question.getOptionD(),
                question.getDifficulty()
        );
    }
}