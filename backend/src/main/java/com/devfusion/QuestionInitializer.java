package com.devfusion.backend;

import com.devfusion.backend.model.Question;
import com.devfusion.backend.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuestionInitializer {

    @Bean
    CommandLineRunner loadQuestions(QuestionRepository questionRepository) {

        return args -> {

            if (questionRepository.count() == 0) {

                // =========================
                // JAVA - BEGINNER
                // =========================

                questionRepository.save(
                        new Question(
                                "Java",
                                "Which keyword is used to inherit a class in Java?",
                                "implements",
                                "extends",
                                "inherits",
                                "super",
                                "B",
                                "Beginner"
                        )
                );

                questionRepository.save(
                        new Question(
                                "Java",
                                "Which method is the entry point of a Java application?",
                                "start()",
                                "run()",
                                "main()",
                                "init()",
                                "C",
                                "Beginner"
                        )
                );

                questionRepository.save(
                        new Question(
                                "Java",
                                "Which collection does not allow duplicate elements?",
                                "List",
                                "Set",
                                "ArrayList",
                                "Vector",
                                "B",
                                "Beginner"
                        )
                );

                // =========================
                // JAVA - INTERMEDIATE
                // =========================

                questionRepository.save(
                        new Question(
                                "Java",
                                "Which concept allows a child class to provide a specific implementation of a parent method?",
                                "Encapsulation",
                                "Inheritance",
                                "Method overriding",
                                "Abstraction",
                                "C",
                                "Intermediate"
                        )
                );

                questionRepository.save(
                        new Question(
                                "Java",
                                "Which interface is commonly used to define a natural ordering of objects?",
                                "Runnable",
                                "Serializable",
                                "Comparable",
                                "Cloneable",
                                "C",
                                "Intermediate"
                        )
                );

                // =========================
                // JAVA - ADVANCED
                // =========================

                questionRepository.save(
                        new Question(
                                "Java",
                                "Which feature allows multiple threads to execute tasks asynchronously using a pool of worker threads?",
                                "Garbage Collector",
                                "ExecutorService",
                                "Scanner",
                                "StringBuilder",
                                "B",
                                "Advanced"
                        )
                );

                // =========================
                // SQL - BEGINNER
                // =========================

                questionRepository.save(
                        new Question(
                                "SQL",
                                "Which SQL command is used to retrieve data from a table?",
                                "GET",
                                "SELECT",
                                "FETCH",
                                "READ",
                                "B",
                                "Beginner"
                        )
                );

                questionRepository.save(
                        new Question(
                                "SQL",
                                "Which clause is used to filter rows in SQL?",
                                "ORDER BY",
                                "GROUP BY",
                                "WHERE",
                                "SORT",
                                "C",
                                "Beginner"
                        )
                );

                questionRepository.save(
                        new Question(
                                "SQL",
                                "Which keyword removes duplicate rows from a result?",
                                "UNIQUE",
                                "DISTINCT",
                                "REMOVE",
                                "FILTER",
                                "B",
                                "Beginner"
                        )
                );

                // =========================
                // SQL - INTERMEDIATE
                // =========================

                questionRepository.save(
                        new Question(
                                "SQL",
                                "Which JOIN returns only matching rows from both tables?",
                                "LEFT JOIN",
                                "RIGHT JOIN",
                                "INNER JOIN",
                                "FULL JOIN",
                                "C",
                                "Intermediate"
                        )
                );

                questionRepository.save(
                        new Question(
                                "SQL",
                                "Which clause is used to filter grouped results?",
                                "WHERE",
                                "HAVING",
                                "ORDER BY",
                                "LIMIT",
                                "B",
                                "Intermediate"
                        )
                );
                // =========================
// SQL - ADVANCED
// =========================

if (questionRepository.findAll().stream().noneMatch(
        q -> q.getSkill().equals("SQL")
                && q.getDifficulty().equals("Advanced")
)) {

    questionRepository.save(
            new Question(
                    "SQL",
                    "Which SQL feature is commonly used to improve query performance by providing a faster way to locate rows?",
                    "Trigger",
                    "Index",
                    "View",
                    "Cursor",
                    "B",
                    "Advanced"
            )
    );
}

                // =========================
                // REACT - BEGINNER
                // =========================

                questionRepository.save(
                        new Question(
                                "React",
                                "Which hook is commonly used to manage state in a React component?",
                                "useEffect",
                                "useState",
                                "useContext",
                                "useRef",
                                "B",
                                "Beginner"
                        )
                );

                questionRepository.save(
                        new Question(
                                "React",
                                "What is JSX?",
                                "A database language",
                                "A JavaScript syntax extension",
                                "A CSS framework",
                                "A backend server",
                                "B",
                                "Beginner"
                        )
                );

                // =========================
                // REACT - INTERMEDIATE
                // =========================

                questionRepository.save(
                        new Question(
                                "React",
                                "Which hook is primarily used for side effects?",
                                "useState",
                                "useMemo",
                                "useEffect",
                                "useCallback",
                                "C",
                                "Intermediate"
                        )
                );

                // =========================
                // SPRING BOOT - BEGINNER
                // =========================

                questionRepository.save(
                        new Question(
                                "Spring Boot",
                                "Which annotation is commonly used to mark a REST controller?",
                                "@Entity",
                                "@RestController",
                                "@Repository",
                                "@Bean",
                                "B",
                                "Beginner"
                        )
                );

                questionRepository.save(
                        new Question(
                                "Spring Boot",
                                "Which annotation is used to map HTTP GET requests?",
                                "@PostMapping",
                                "@PutMapping",
                                "@GetMapping",
                                "@DeleteMapping",
                                "C",
                                "Beginner"
                        )
                );

                // =========================
                // SPRING BOOT - INTERMEDIATE
                // =========================

                questionRepository.save(
                        new Question(
                                "Spring Boot",
                                "Which Spring component is normally responsible for database access?",
                                "@Controller",
                                "@Service",
                                "@Repository",
                                "@ComponentScan",
                                "C",
                                "Intermediate"
                        )
                );

                questionRepository.save(
                        new Question(
                                "Spring Boot",
                                "Which technology is commonly used by Spring Data JPA to map Java objects to database tables?",
                                "Hibernate",
                                "React",
                                "Node.js",
                                "Bootstrap",
                                "A",
                                "Intermediate"
                        )
                );
            }
        };
    }
}