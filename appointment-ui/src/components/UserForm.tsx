import { useEffect, useState } from "react";
import { createUser, updateUser } from "../api/userService";
import type { User } from "../api/userService";

interface Props {
  onUserCreated: (user: User) => void;

  // 🔹 NEW props (required for edit)
  editingUser: User | null;
  onUserUpdated: (user: User) => void;
  onCancelEdit: () => void;
}

function UserForm({
  onUserCreated,
  editingUser,
  onUserUpdated,
  onCancelEdit,
}: Props) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  /* =======================
     Fill form when editing
  ======================= */
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setPhoneNumber(editingUser.phoneNumber);
      setEmail(editingUser.email);
    } else {
      setName("");
      setPhoneNumber("");
      setEmail("");
    }
  }, [editingUser]);

  /* =======================
     Submit handler
  ======================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser && editingUser.id) {
        // 🔹 UPDATE
        const updated = await updateUser(editingUser.id, {
          name,
          phoneNumber,
          email,
        });
        onUserUpdated(updated);
      } else {
        // 🔹 CREATE
        const created = await createUser({ name, phoneNumber, email });
        onUserCreated(created);
      }

      setName("");
      setPhoneNumber("");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-sky-700">
        {editingUser ? "Edit User" : "Add User"}
      </h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full border p-2 rounded mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full border p-2 rounded mb-3"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
        >
          {editingUser ? "Update" : "Create"}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
