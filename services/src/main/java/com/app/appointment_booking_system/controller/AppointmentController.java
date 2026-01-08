package com.app.appointment_booking_system.controller;

import com.app.appointment_booking_system.dto.CreateAppointmentRequest;
import com.app.appointment_booking_system.dto.UpdateAppointmentRequest;
import com.app.appointment_booking_system.model.Appointment;
import com.app.appointment_booking_system.model.Appointment.AppointmentStatus;
import com.app.appointment_booking_system.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // CREATE APPOINTMENT (Admin only - enforced by authentication)
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {
        Appointment appointment = appointmentService.createAppointment(request);
        return new ResponseEntity<>(appointment, HttpStatus.CREATED);
    }

    // GET ALL APPOINTMENTS
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // GET APPOINTMENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET APPOINTMENTS BY USER ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUserId(userId));
    }

    // GET APPOINTMENTS BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
            @PathVariable AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    // GET APPOINTMENTS BY DATE
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
    }

    // GET APPOINTMENTS IN DATE RANGE
    @GetMapping("/range")
    public ResponseEntity<List<Appointment>> getAppointmentsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(appointmentService.getAppointmentsInRange(startDate, endDate));
    }

    // CHECK AVAILABILITY
    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        boolean available = appointmentService.isTimeSlotAvailable(dateTime);
        return ResponseEntity.ok(available);
    }

    // UPDATE APPOINTMENT
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAppointmentRequest request) {
        Appointment appointment = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(appointment);
    }

    // CANCEL APPOINTMENT
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(appointment);
    }

    // COMPLETE APPOINTMENT
    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentService.completeAppointment(id);
        return ResponseEntity.ok(appointment);
    }

    // DELETE APPOINTMENT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        // Note: In a real system, you might want to soft delete or check permissions
        // For now, we'll just allow deletion
        appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Appointment not found"));
        // If you want to add delete functionality to service, uncomment:
        // appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
