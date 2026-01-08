package com.app.appointment_booking_system.config;

import com.app.appointment_booking_system.model.Admin;
import com.app.appointment_booking_system.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeAdmin() {
        try {
            // Initialize default admin if not exists
            if (adminRepository.findByEmail("admin@system.com").isEmpty()) {
                Admin admin = new Admin();
                admin.setName("admin");
                admin.setEmail("admin@system.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                
                adminRepository.save(admin);
                logger.info("✅ Default admin user initialized successfully!");
                logger.info("   Email: admin@system.com");
                logger.info("   Password: admin123");
            } else {
                logger.info("ℹ️  Admin user already exists, skipping initialization");
            }
        } catch (Exception e) {
            logger.error("❌ Failed to initialize admin user: {}", e.getMessage(), e);
        }
    }
}

