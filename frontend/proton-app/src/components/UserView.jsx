import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

import { useTranslation } from "../hooks/useTranslation";

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

export default function UserView({ user, logout }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const t = useTranslation("userView"); // namespace

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
        setTimeout(() => setOpen(false), 1500);
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
    <div className="flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="bg-white rounded-lg p-6 sm:p-8 shadow max-w-md w-full mx-auto">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          {t("title")}
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-4 sm:p-6 border border-yellow-300">
            <div className="space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <span className="text-gray-700 font-medium text-lg">{t("email")}: </span>
                <span className="text-gray-800 font-bold text-lg break-all">{user.email}</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <span className="text-gray-700 font-medium text-lg">{t("role")}: </span>
                <span className="text-gray-800 font-bold text-lg">{user.role || (user.is_superuser ? t("admin") : t("user"))}</span>
              </div>
            </div>
          </div>

          {/* Кнопка смены пароля */}
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            {t("changePasswordButton")}
          </button>

          {/* Кнопка выхода */}
          <button
            onClick={handleLogout}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            {t("leaveButton")}
          </button>
        </div>
      </div>

      {/* Диалог смены пароля */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("changePassword")}</DialogTitle>
        <form onSubmit={handleChangePassword}>
          <DialogContent className="flex flex-col gap-4 w-80">
            <TextField
              label={t("oldPassword")}
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t("newPassword")}
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
            <Button onClick={() => setOpen(false)}>{t("cancelButton")}</Button>
            <Button type="submit" variant="contained" color="primary">
              {t("saveButton")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}