package com.devfusion.backend;

import com.devfusion.backend.model.Skill;
import com.devfusion.backend.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadData(SkillRepository skillRepository) {

        return args -> {

            if (skillRepository.count() == 0) {

                Skill java = new Skill();
                java.setName("Java");
                java.setScore(85);
                skillRepository.save(java);

                Skill sql = new Skill();
                sql.setName("SQL");
                sql.setScore(75);
                skillRepository.save(sql);

                Skill react = new Skill();
                react.setName("React");
                react.setScore(60);
                skillRepository.save(react);

                Skill spring = new Skill();
                spring.setName("Spring Boot");
                spring.setScore(40);
                skillRepository.save(spring);
            }
        };
    }
}
