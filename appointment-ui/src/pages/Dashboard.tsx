import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getAllUsers, deleteUser } from "../api/userService";
import type { User } from "../api/userService";
import UserForm from "../components/UserForm";
import AppointmentCalendar from "../components/AppointmentCalendar";
import AppointmentList from "../components/AppointmentList";
import type { Appointment } from "../api/appointmentService";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "appointments">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointmentRefreshTrigger, setAppointmentRefreshTrigger] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = (user: User) => {
    setUsers([...users, user]);
    setEditingUser(null);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null);
  };

  const handleDelete = async (id: number) => {
    if (!globalThis.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAppointmentCreated = (appointment: Appointment) => {
    setAppointmentRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-sky-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-sky-700">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "appointments"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Appointment Management
            </button>
          </nav>
        </div>

        {/* User Management Tab */}
        {activeTab === "users" && (
          <>
            {/* User Form */}
            <UserForm
              onUserCreated={handleUserCreated}
              editingUser={editingUser}
              onUserUpdated={handleUserUpdated}
              onCancelEdit={handleCancelEdit}
            />

            {/* Users List */}
            <div className="bg-white rounded-xl shadow overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-sky-700">Users List</h2>
              </div>

              {loading && (
                <div className="p-6 text-center text-gray-500">Loading users...</div>
              )}
              {!loading && users.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No users found. Create your first user above!
                </div>
              )}
              {!loading && users.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.phoneNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-sky-600 hover:text-sky-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => user.id && handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Appointment Management Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            {/* Appointment Calendar */}
            <AppointmentCalendar onAppointmentCreated={handleAppointmentCreated} />

            {/* Appointment List */}
            <AppointmentList refreshTrigger={appointmentRefreshTrigger} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
