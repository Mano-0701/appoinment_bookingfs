package com.app.appointment_booking_system.dto;

import jakarta.validation.constraints.Future;
import com.app.appointment_booking_system.model.Appointment.AppointmentStatus;
import java.time.LocalDateTime;

public class UpdateAppointmentRequest {

    private Long userId;
    
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDateTime;

    private String notes;

    private AppointmentStatus status;

    public UpdateAppointmentRequest() {}

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

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}
