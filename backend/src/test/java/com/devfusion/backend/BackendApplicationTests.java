package com.devfusion.backend;

import com.devfusion.backend.model.AIAnalysis;
import com.devfusion.backend.model.ProgressHistory;
import com.devfusion.backend.model.RoadmapProgress;
import com.devfusion.backend.model.User;
import com.devfusion.backend.model.UserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
class BackendApplicationTests {

    @Autowired
    private UserController userController;

    @Autowired
    private RoadmapProgressController roadmapProgressController;

    @Autowired
    private ProgressHistoryController progressHistoryController;

    @Autowired
    private AIAnalysisController aiAnalysisController;

    @Test
    void contextLoads() {
    }

    @Test
    void createsUserWithStudentRole() {
        ResponseEntity<?> response = userController.createUser(
                createUser("Aarav", "aarav@example.com")
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());

        UserResponse savedUser = assertInstanceOf(UserResponse.class, response.getBody());
        assertNotNull(savedUser.id());
        assertEquals("STUDENT", savedUser.role());
        assertEquals("Backend Developer", savedUser.careerGoal());
    }

    @Test
    void rejectsDuplicateEmailAddresses() {
        userController.createUser(createUser("Aarav", "aarav@example.com"));

        ResponseEntity<?> duplicateResponse = userController.createUser(
                createUser("Another Aarav", "aarav@example.com")
        );

        assertEquals(HttpStatus.CONFLICT, duplicateResponse.getStatusCode());
        assertEquals("Email already registered", duplicateResponse.getBody());
    }

    @Test
    void savesRoadmapProgressAndHistory() {
        User user = createSavedUser("Meera", "meera@example.com");
        RoadmapProgress update = new RoadmapProgress(user.getId());
        update.setCompletedSteps("1,3");
        update.setProgressPercentage(40);

        RoadmapProgress savedProgress = roadmapProgressController.updateRoadmap(
                user.getId(), update
        );
        List<ProgressHistory> history = progressHistoryController.getHistory(user.getId());

        assertEquals("1,3", savedProgress.getCompletedSteps());
        assertEquals(40, savedProgress.getProgressPercentage());
        assertEquals(2, history.size());
    }

    @Test
    void calculatesAnalysisFromSavedRoadmapProgress() {
        User user = createSavedUser("Diya", "diya@example.com");
        RoadmapProgress update = new RoadmapProgress(user.getId());
        update.setCompletedSteps("1,2");
        update.setProgressPercentage(40);
        roadmapProgressController.updateRoadmap(user.getId(), update);

        AIAnalysis analysis = aiAnalysisController.getAnalysis(user.getId());

        assertEquals(2, analysis.getCompletedSteps());
        assertEquals(5, analysis.getTotalSteps());
        assertEquals("40%", analysis.getProgress());
        assertEquals("Intermediate Backend Developer", analysis.getLevel());
        assertEquals("Learn MySQL Database Integration", analysis.getNextRecommendation());
    }

    private User createSavedUser(String name, String email) {
        ResponseEntity<?> response = userController.createUser(createUser(name, email));
        UserResponse responseBody = assertInstanceOf(UserResponse.class, response.getBody());
        User user = new User();
        user.setId(responseBody.id());
        return user;
    }

    private User createUser(String name, String email) {
        return new User(
                name,
                email,
                "test-password",
                null,
                "Backend Developer"
        );
    }
}
