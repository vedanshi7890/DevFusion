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
// ADDITIONAL JAVA QUESTIONS
// =========================

questionRepository.save(
        new Question(
                "Java",
                "Which keyword is used to create an object in Java?",
                "class",
                "new",
                "object",
                "create",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which keyword is used to prevent a variable from being changed?",
                "static",
                "final",
                "const",
                "private",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which data type is used to store a single character?",
                "String",
                "char",
                "Character",
                "text",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which keyword is used to define a class that cannot be inherited?",
                "static",
                "final",
                "private",
                "sealed",
                "B",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which concept means hiding internal implementation details?",
                "Inheritance",
                "Polymorphism",
                "Abstraction",
                "Compilation",
                "C",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which collection stores key-value pairs?",
                "ArrayList",
                "HashSet",
                "HashMap",
                "Queue",
                "C",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which collection does not maintain insertion order and does not allow duplicate elements?",
                "ArrayList",
                "HashSet",
                "LinkedList",
                "Vector",
                "B",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which keyword is used to handle an exception?",
                "catch",
                "throw",
                "throws",
                "exception",
                "A",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which block is normally executed whether an exception occurs or not?",
                "try",
                "catch",
                "finally",
                "throw",
                "C",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which keyword is used to explicitly throw an exception?",
                "throws",
                "throw",
                "catch",
                "finally",
                "B",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which method is used to start a new thread?",
                "run()",
                "execute()",
                "start()",
                "begin()",
                "C",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which keyword is used to implement an interface?",
                "extends",
                "implements",
                "inherits",
                "interface",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which OOP principle allows one interface to have multiple implementations?",
                "Encapsulation",
                "Inheritance",
                "Polymorphism",
                "Compilation",
                "C",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "Java",
                "Which class is the parent class of all Java classes?",
                "Main",
                "Class",
                "Object",
                "System",
                "C",
                "Beginner"
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
// ADDITIONAL SQL QUESTIONS
// =========================

questionRepository.save(
        new Question(
                "SQL",
                "Which command is used to add a new row to a table?",
                "INSERT",
                "ADD",
                "CREATE",
                "UPDATE",
                "A",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which command is used to modify existing records?",
                "CHANGE",
                "UPDATE",
                "MODIFY",
                "ALTER",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which command is used to remove rows from a table?",
                "REMOVE",
                "DELETE",
                "DROP",
                "CLEAR",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which constraint uniquely identifies each row in a table?",
                "FOREIGN KEY",
                "PRIMARY KEY",
                "UNIQUE KEY",
                "CHECK",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which constraint is used to establish a relationship between two tables?",
                "PRIMARY KEY",
                "FOREIGN KEY",
                "CHECK",
                "DEFAULT",
                "B",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which function returns the number of rows?",
                "SUM()",
                "COUNT()",
                "TOTAL()",
                "NUMBER()",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which clause is used to sort query results?",
                "SORT BY",
                "ORDER BY",
                "GROUP BY",
                "ARRANGE BY",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which JOIN returns all rows from the left table and matching rows from the right table?",
                "INNER JOIN",
                "RIGHT JOIN",
                "LEFT JOIN",
                "FULL JOIN",
                "C",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which clause groups rows that have the same values?",
                "GROUP BY",
                "ORDER BY",
                "WHERE",
                "HAVING",
                "A",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which operator is used to search for a pattern in a string?",
                "MATCH",
                "LIKE",
                "SEARCH",
                "PATTERN",
                "B",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which operator is used to check whether a value falls within a range?",
                "BETWEEN",
                "RANGE",
                "WITHIN",
                "INRANGE",
                "A",
                "Beginner"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which keyword is used to combine the results of two SELECT queries?",
                "COMBINE",
                "MERGE",
                "UNION",
                "JOIN",
                "C",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "What is a subquery?",
                "A query inside another query",
                "A duplicate table",
                "A database backup",
                "A table constraint",
                "A",
                "Intermediate"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which index is generally created automatically for a primary key?",
                "Primary index",
                "Hash index",
                "Temporary index",
                "View index",
                "A",
                "Advanced"
        )
);

questionRepository.save(
        new Question(
                "SQL",
                "Which database object is a virtual table based on a query?",
                "Index",
                "View",
                "Trigger",
                "Cursor",
                "B",
                "Intermediate"
        )
);

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
             