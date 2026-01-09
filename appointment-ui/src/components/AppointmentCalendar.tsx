import { useState, useEffect } from "react";
import {
  getAllAppointments,
  createAppointment,
  checkAvailability,
  type Appointment,
  type CreateAppointmentRequest,
} from "../api/appointmentService";
import { getAllUsers, type User } from "../api/userService";

interface AppointmentCalendarProps {
  onAppointmentCreated?: (appointment: Appointment) => void;
}

const AppointmentCalendar = ({ onAppointmentCreated }: AppointmentCalendarProps) => {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Time slots (9 AM to 5 PM, hourly)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  useEffect(() => {
    loadUsers();
    loadAppointments();
  }, [selectedDate]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointment:", err);
    }
  };

  const isTimeSlotBooked = (time: string): boolean => {
    const dateTime = `${selectedDate}T${time}:00`;
    return appointments.some(
      (apt) =>
        apt.appointmentDateTime.startsWith(dateTime) &&
        apt.status === "SCHEDULED"
    );
  };

  const handleBookAppointment = async () => {
    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const dateTime = `${selectedDate}T${selectedTime}:00`;

      // Check availability
      const available = await checkAvailability(dateTime);
      if (!available) {
        setError("This time slot is already booked. Please select another time.");
        setLoading(false);
        return;
      }

      const request: CreateAppointmentRequest = {
        userId: selectedUserId,
        appointmentDateTime: dateTime,
        notes: notes.trim() || undefined,
      };

      const appointment = await createAppointment(request);
      setSuccess("Appointment booked successfully!");

      // ✅ RESET FORM AFTER SUCCESS
      setSelectedUserId(null);
      setSelectedDate(today);
      setSelectedTime("09:00");
      setNotes("");

      await loadAppointments();

      onAppointmentCreated?.(appointment);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Failed to book appointment:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-sky-700 mb-4">
        Book Appointment
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* User Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User *
          </label>
          <select
            value={selectedUserId ?? ""}
            onChange={(e) => setSelectedUserId(Number(e.target.value) || null)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Slot *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const booked = isTimeSlotBooked(time);
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => !booked && setSelectedTime(time)}
                  disabled={booked}
                  className={`p-2 border rounded text-sm transition ${
                    booked
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : selectedTime === time
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-gray-700 hover:bg-sky-50 border-gray-300"
                  }`}
                >
                  {time}
                  {booked && " (Booked)"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Add any additional notes..."
          />
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookAppointment}
          disabled={loading || !selectedUserId}
          className="w-full bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
