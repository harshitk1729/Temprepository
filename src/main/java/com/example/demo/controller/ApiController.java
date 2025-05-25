package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.SampleRepository;

@RestController
public class ApiController {

    @GetMapping("/api/message")
    public String getMessage() {
        return "Hello from Spring Boot again";
    }
    @Autowired
    private SampleRepository sampleRepository;

    @GetMapping("/api/test-connection")
    public String testDatabaseConnection() {
        boolean isConnected = sampleRepository.testConnection();
        return isConnected ? "Database connection is successful!" : "Database connection failed!";
    }
}


