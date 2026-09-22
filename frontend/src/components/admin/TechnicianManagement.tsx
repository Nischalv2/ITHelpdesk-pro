import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "technician" | "admin";
}

function TechnicianManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Unable to load users."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (
    userId: string,
    newRole: "user" | "technician"
  ) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Authentication required.");
        return;
      }

      setUpdatingUser(userId);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/users/${userId}/role`,
        {
          role: newRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: response.data.user.role,
              }
            : user
        )
      );
    } catch (error) {
      console.error("Error changing user role:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Unable to change user role."
        );
      }
    } finally {
      setUpdatingUser(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <section className="admin-section">
        <p>Loading users...</p>
      </section>
    );
  }

  return (
    <section className="admin-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>

          <h2>User &amp; Role Management</h2>

          <p>
            Manage users and assign responsibilities within the
            IT helpdesk.
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>

          <h3>No users found</h3>

          <p>
            There are currently no users in the system.
          </p>
        </div>
      ) : (
        <div className="technician-list">
          {users.map((user) => (
            <article
              className="technician-card"
              key={user._id}
            >
              <div className="technician-avatar">
                {user.role === "admin"
                  ? "🛡️"
                  : user.role === "technician"
                  ? "👨‍💻"
                  : "👤"}
              </div>

              <div className="technician-info">
                <h3>{user.name}</h3>

                <p>{user.email}</p>

                <span className="status-badge">
                  {user.role.toUpperCase()}
                </span>
              </div>

              <div>
                {user.role === "admin" ? (
                  <span>Admin account</span>
                ) : (
                  <select
                    value={user.role}
                    disabled={updatingUser === user._id}
                    onChange={(event) =>
                      changeRole(
                        user._id,
                        event.target.value as
                          | "user"
                          | "technician"
                      )
                    }
                  >
                    <option value="user">User</option>

                    <option value="technician">
                      Technician
                    </option>
                  </select>
                )}

                {updatingUser === user._id && (
                  <p>Updating...</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TechnicianManagement;