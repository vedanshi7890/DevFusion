package com.devfusion.backend;

import com.devfusion.backend.model.Skill;
import com.devfusion.backend.repository.SkillRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping("/{userId}")
    public List<Skill> getUserSkills(@PathVariable Long userId) {

        return skillRepository.findByUserId(userId);
    }
}