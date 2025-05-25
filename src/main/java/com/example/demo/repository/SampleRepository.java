package com.example.demo.repository;

import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@Repository
public class SampleRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public boolean testConnection() {
        try {
            // Execute a simple query to test the connection
            // Change the return type to BigDecimal which is what Oracle typically returns for numbers
            Object result = entityManager.createNativeQuery("SELECT 1 FROM DUAL").getSingleResult();
            return result != null;
        } catch (Exception e) {
            // Log the exception with full details
            System.err.println("Database connection error: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
