package com.app.appointment_booking_system.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;

public class CreateAppointmentRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDateTime;

    private String notes;

    public CreateAppointmentRequest() {}

    public CreateAppointmentRequest(Long userId, LocalDateTime appointmentDateTime, String notes) {
        this.userId = userId;
        this.appointmentDateTime = appointmentDateTime;
        this.notes = notes;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
