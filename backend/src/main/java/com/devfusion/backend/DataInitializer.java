package com.devfusion.backend;

import com.devfusion.backend.model.User;
import com.devfusion.backend.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadData(UserRepository userRepository) {

        return args -> {

            if (userRepository.count() == 0) {

                User user = new User(
                        "Demo Student",
                        "demo@devfusion.com",
                        "demo123",
                        "STUDENT",
                        "Backend Developer"
                );

                userRepository.save(user);
            }
        };
    }
}