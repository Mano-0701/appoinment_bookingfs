import { useState, useEffect } from "react";
import {
  getAllAppointments,
  cancelAppointment,
  completeAppointment,
  updateAppointment,
  type Appointment,
  AppointmentStatus,
  type UpdateAppointmentRequest,
} from "../api/appointmentService";

interface AppointmentListProps {
  refreshTrigger?: number;
}

const AppointmentList = ({ refreshTrigger }: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "ALL">("ALL");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");

  useEffect(() => {
    loadAppointments();
  }, [refreshTrigger]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAllAppointments();
      // Sort by date/time (newest first)
      data.sort(
        (a, b) =>
          new Date(b.appointmentDateTime).getTime() -
          new Date(a.appointmentDateTime).getTime()
      );
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await cancelAppointment(id);
      await loadAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      alert("Failed to cancel appointment");
    }
  };

  const handleComplete = async (id: number) => {
    if (!confirm("Mark this appointment as completed?")) {
      return;
    }

    try {
      await completeAppointment(id);
      await loadAppointments();
    } catch (err) {
      console.error("Failed to complete appointment:", err);
      alert("Failed to complete appointment");
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingId(appointment.id || null);
    setEditNotes(appointment.notes || "");
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const request: UpdateAppointmentRequest = {
        notes: editNotes,
      };
      await updateAppointment(id, request);
      setEditingId(null);
      setEditNotes("");
      await loadAppointments();
    } catch (err) {
      console.error("Failed to update appointment:", err);
      alert("Failed to update appointment");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNotes("");
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800";
      case AppointmentStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case AppointmentStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sky-700">Appointments</h2>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as AppointmentStatus | "ALL")
          }
          className="p-2 border rounded text-sm"
        >
          <option value="ALL">All Status</option>
          <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
          <option value={AppointmentStatus.COMPLETED}>Completed</option>
          <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
        </select>
      </div>

      {loading && (
        <div className="p-6 text-center text-gray-500">Loading appointments...</div>
      )}

      {!loading && filteredAppointments.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No appointments found.
        </div>
      )}

      {!loading && filteredAppointments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-gray-900">
                      {appointment.user.name}
                    </div>
                    <div className="text-gray-500">{appointment.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(appointment.appointmentDateTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editingId === appointment.id ? (
                      <div className="flex items-center gap-2">
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={2}
                          className="flex-1 p-1 border rounded text-sm"
                        />
                        <button
                          onClick={() => appointment.id && handleSaveEdit(appointment.id)}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="max-w-xs truncate">
                        {appointment.notes || "-"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {appointment.status === AppointmentStatus.SCHEDULED && (
                        <>
                          <button
                            onClick={() => appointment.id && handleEdit(appointment)}
                            className="text-sky-600 hover:text-sky-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              appointment.id && handleComplete(appointment.id)
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() =>
                              appointment.id && handleCancel(appointment.id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === AppointmentStatus.COMPLETED && (
                        <span className="text-gray-400">Completed</span>
                      )}
                      {appointment.status === AppointmentStatus.CANCELLED && (
                        <span className="text-gray-400">Cancelled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
