package com.devfusion.backend.repository;

import com.devfusion.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findBySkill(String skill);
}