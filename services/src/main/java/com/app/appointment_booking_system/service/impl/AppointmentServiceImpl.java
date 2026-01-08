package com.app.appointment_booking_system.service.impl;

import com.app.appointment_booking_system.dto.CreateAppointmentRequest;
import com.app.appointment_booking_system.dto.UpdateAppointmentRequest;
import com.app.appointment_booking_system.model.Appointment;
import com.app.appointment_booking_system.model.Appointment.AppointmentStatus;
import com.app.appointment_booking_system.model.User;
import com.app.appointment_booking_system.repository.AppointmentRepository;
import com.app.appointment_booking_system.repository.UserRepository;
import com.app.appointment_booking_system.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public Appointment createAppointment(CreateAppointmentRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        // Check for double-booking (prevent overlapping appointments)
        if (!isTimeSlotAvailable(request.getAppointmentDateTime())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, 
                    "Time slot is already booked. Please select another time.");
        }

        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public List<Appointment> getAppointmentsByUserId(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    @Override
    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        return appointmentRepository.findScheduledAppointmentsByDate(startOfDay, endOfDay);
    }

    @Override
    public List<Appointment> getAppointmentsInRange(LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.findScheduledAppointmentsInRange(startDate, endDate);
    }

    @Override
    public boolean isTimeSlotAvailable(LocalDateTime dateTime) {
        return appointmentRepository.findScheduledAppointmentByDateTime(dateTime).isEmpty();
    }

    @Override
    @Transactional
    public Appointment updateAppointment(Long id, UpdateAppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Appointment not found"));

        // Update user if provided
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "User not found"));
            appointment.setUser(user);
        }

        // Check for double-booking if date/time is being changed
        if (request.getAppointmentDateTime() != null) {
            LocalDateTime newDateTime = request.getAppointmentDateTime();
            // Only check if it's different from current time and not the same appointment
            if (!newDateTime.equals(appointment.getAppointmentDateTime())) {
                Optional<Appointment> existing = appointmentRepository
                        .findScheduledAppointmentByDateTime(newDateTime);
                if (existing.isPresent() && !existing.get().getId().equals(id)) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Time slot is already booked. Please select another time.");
                }
            }
            appointment.setAppointmentDateTime(newDateTime);
        }

        // Update notes if provided
        if (request.getNotes() != null) {
            appointment.setNotes(request.getNotes());
        }

        // Update status if provided
        if (request.getStatus() != null) {
            appointment.setStatus(request.getStatus());
        }

        return appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public Appointment cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public Appointment completeAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Appointment is already completed");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cannot complete a cancelled appointment");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        return appointmentRepository.save(appointment);
    }
}
