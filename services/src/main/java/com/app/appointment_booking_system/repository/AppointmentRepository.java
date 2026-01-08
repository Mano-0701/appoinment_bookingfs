package com.app.appointment_booking_system.repository;

import com.app.appointment_booking_system.model.Appointment;
import com.app.appointment_booking_system.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find appointments by user
    List<Appointment> findByUserId(Long userId);

    // Find appointments by status
    List<Appointment> findByStatus(AppointmentStatus status);

    // Find appointments by user and status
    List<Appointment> findByUserIdAndStatus(Long userId, AppointmentStatus status);

    // Check for overlapping appointments (same time slot, scheduled status)
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime = :appointmentDateTime " +
           "AND a.status = 'SCHEDULED'")
    Optional<Appointment> findScheduledAppointmentByDateTime(@Param("appointmentDateTime") LocalDateTime appointmentDateTime);

    // Find all scheduled appointments in a date range
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime >= :startDate " +
           "AND a.appointmentDateTime < :endDate " +
           "AND a.status = 'SCHEDULED' " +
           "ORDER BY a.appointmentDateTime ASC")
    List<Appointment> findScheduledAppointmentsInRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Find appointments for a specific date
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime >= :startOfDay " +
           "AND a.appointmentDateTime < :endOfDay " +
           "AND a.status = 'SCHEDULED' " +
           "ORDER BY a.appointmentDateTime ASC")
    List<Appointment> findScheduledAppointmentsByDate(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}
