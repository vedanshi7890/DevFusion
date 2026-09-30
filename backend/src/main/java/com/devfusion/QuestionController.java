package com.devfusion.backend;

import com.devfusion.backend.model.Question;
import com.devfusion.backend.model.QuestionResponse;
import com.devfusion.backend.repository.QuestionRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
})
public class QuestionController {

    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping("/{skill}")
    public List<QuestionResponse> getSkillAssessment(
            @PathVariable String skill) {

        List<Question> questions =
                questionRepository.findBySkill(skill);

        Collections.shuffle(questions);

        List<Question> selectedQuestions =
                questions.stream()
                        .limit(5)
                        .toList();

        return selectedQuestions.stream()
                .map(QuestionResponse::from)
                .toList();
    }
}