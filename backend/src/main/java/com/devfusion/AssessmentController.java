package com.devfusion.backend;

import com.devfusion.backend.model.AssessmentAttempt;
import com.devfusion.backend.model.AssessmentRequest;
import com.devfusion.backend.model.AssessmentResult;
import com.devfusion.backend.model.Question;
import com.devfusion.backend.model.Skill;
import com.devfusion.backend.model.User;
import com.devfusion.backend.repository.AssessmentAttemptRepository;
import com.devfusion.backend.repository.QuestionRepository;
import com.devfusion.backend.repository.SkillRepository;
import com.devfusion.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessment")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AssessmentController {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final AssessmentAttemptRepository assessmentAttemptRepository;

    public AssessmentController(
            QuestionRepository questionRepository,
            UserRepository userRepository,
            SkillRepository skillRepository,
            AssessmentAttemptRepository assessmentAttemptRepository) {

        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.assessmentAttemptRepository = assessmentAttemptRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAssessment(
            @RequestBody AssessmentRequest request) {

        User user = userRepository
                .findById(request.userId())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        Map<Long, String> answers = request.answers();

List<Question> questions =
        questionRepository.findAllById(answers.keySet());

        if (questions.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("No questions found for this skill");
        }

       
        int correctAnswers = 0;

        for (Question question : questions) {

            String userAnswer = answers.get(question.getId());

            if (userAnswer != null &&
                    userAnswer.equalsIgnoreCase(question.getCorrectAnswer())) {

                correctAnswers++;
            }
        }

        int totalQuestions = questions.size();

        int score = (correctAnswers * 100) / totalQuestions;

        Skill skill = skillRepository
                .findByUserIdAndName(user.getId(), request.skill())
                .orElse(new Skill(
                        request.skill(),
                        score,
                        user
                ));

        skill.setScore(score);
        skill.setUser(user);

        skillRepository.save(skill);

        // Save assessment attempt
        AssessmentAttempt attempt = new AssessmentAttempt(
                user.getId(),
                request.skill(),
                score,
                correctAnswers,
                totalQuestions
        );

        AssessmentAttempt savedAttempt =
        assessmentAttemptRepository.save(attempt);

System.out.println(
        "ASSESSMENT SAVED: ID=" + savedAttempt.getId()
                + ", USER=" + savedAttempt.getUserId()
                + ", SKILL=" + savedAttempt.getSkill()
                + ", SCORE=" + savedAttempt.getScore()
);

        AssessmentResult result = new AssessmentResult(
                request.skill(),
                totalQuestions,
                correctAnswers,
                score
        );

        return ResponseEntity.ok(result);
    }
}