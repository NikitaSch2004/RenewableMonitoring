import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";

// MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function UsersList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await api.get('admin/get/users/', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUsers(response.data.data);
      } catch (err) {
        setError("Failed to load users list");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.token) {
      fetchUsers();
    }
  }, [user?.token]);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="border border-gray-200 mx-auto">
        <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-white">
            <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">Users List</h2>
            <p className="text-gray-500 text-sm">Total users {users.length}</p>
        </div>
            
            <TableContainer component={Paper} className="shadow-none">
            <Table>
                <TableHead>
                <TableRow className="bg-gray-50">
                    <TableCell className="font-semibold">ID</TableCell>
                    <TableCell className="font-semibold">Email</TableCell>
                    <TableCell className="font-semibold">Role</TableCell>
                    <TableCell className="font-semibold">Created Date</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {users.map((userData) => (
                    <TableRow
                    key={userData.id}
                    className="hover:bg-gray-50"
                    >
                    <TableCell className="font-medium">{userData.id}</TableCell>
                    <TableCell className="break-all">{userData.email}</TableCell>
                    <TableCell>
                        <Chip
                        label={userData.is_superuser ? "Admin" : "User"}
                        color={userData.is_superuser ? "primary" : "default"}
                        variant={userData.is_superuser ? "filled" : "outlined"}
                        size="small"
                        />
                    </TableCell>
                    <TableCell className="text-gray-600">
                        {formatDate(userData.date_created)}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    </div>
  );
}