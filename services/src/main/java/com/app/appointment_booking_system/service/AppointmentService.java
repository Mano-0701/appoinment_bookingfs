package com.app.appointment_booking_system.service;

import com.app.appointment_booking_system.dto.CreateAppointmentRequest;
import com.app.appointment_booking_system.dto.UpdateAppointmentRequest;
import com.app.appointment_booking_system.model.Appointment;
import com.app.appointment_booking_system.model.Appointment.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    // CREATE
    Appointment createAppointment(CreateAppointmentRequest request);

    // READ
    List<Appointment> getAllAppointments();
    
    Optional<Appointment> getAppointmentById(Long id);
    
    List<Appointment> getAppointmentsByUserId(Long userId);
    
    List<Appointment> getAppointmentsByStatus(AppointmentStatus status);
    
    List<Appointment> getAppointmentsByDate(LocalDate date);
    
    List<Appointment> getAppointmentsInRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Check availability for a specific time slot
    boolean isTimeSlotAvailable(LocalDateTime dateTime);

    // UPDATE
    Appointment updateAppointment(Long id, UpdateAppointmentRequest request);

    // CANCEL
    Appointment cancelAppointment(Long id);

    // COMPLETE
    Appointment completeAppointment(Long id);
}
