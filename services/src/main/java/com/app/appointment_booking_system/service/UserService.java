package com.app.appointment_booking_system.service;

import com.app.appointment_booking_system.dto.CreateUserRequest;
import com.app.appointment_booking_system.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // CREATE
    User createUser(CreateUserRequest request);

    // READ
    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    // UPDATE
    User updateUser(Long id, User user);

    // DELETE
    void deleteUser(Long id);
}
