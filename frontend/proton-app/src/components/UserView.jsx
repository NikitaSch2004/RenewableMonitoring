import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";

export default function UserView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        `/change-password/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Password changed successfully ✅");
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => setOpen(false), 1500); // закрыть через 1.5с
      } else {
        setError(response.data.message || "Password change failed");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Password change failed");
      } else {
        setError("Network error. Try again later.");
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg p-8 shadow max-w-md w-full mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Welcome
        </h2>

        <div className="space-y-4">
          <p className="text-gray-700 text-lg text-center">Your token:</p>
          <div className="bg-gray-100 rounded-lg p-4 border">
            <span className="font-mono text-sm text-gray-800 break-all">
              {user.token}
            </span>
          </div>
        </div>

        {/* Кнопка смены пароля */}
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
        >
          Change Password
        </button>

        {/* Кнопка выхода */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
        >
          Leave
        </button>
      </div>

      {/* Диалог смены пароля */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handleChangePassword}>
          <DialogContent className="flex flex-col gap-4 w-80">
            <TextField
              label="Old password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
