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

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class QuestionController {

    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping("/{skill}")
    public List<QuestionResponse> getQuestionsBySkill(
            @PathVariable String skill) {

        List<Question> questions =
                questionRepository.findBySkill(skill);

        return questions.stream()
                .map(QuestionResponse::from)
                .toList();
    }
}