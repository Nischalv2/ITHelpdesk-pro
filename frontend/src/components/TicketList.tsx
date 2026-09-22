import { useEffect, useState } from "react";
import axios from "axios";

interface Technician {
  _id: string;
  name: string;
  email: string;
  role: "technician";
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: Technician | null;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  createdAt?: string;
}

interface Props {
  refresh: boolean;
}

function TicketList({ refresh }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  const API_URL = "https://ithelpdesk-pro.onrender.com";

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getUser = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  };

  // =====================================================
  // FETCH TICKETS
  // =====================================================

  // =====================================================
// FETCH TICKETS
// =====================================================

const fetchTickets = async () => {
  try {
    setLoading(true);

    const token = getToken();

    if (!token) {
      console.error("No authentication token found.");
      setTickets([]);
      return;
    }

    const user = getUser();

    let endpoint =
      `${API_URL}/api/tickets`;

    if (user?.role === "technician") {
      endpoint =
        `${API_URL}/api/tickets/assigned`;
    }

    if (user?.role === "user") {
      endpoint =
        `${API_URL}/api/tickets/my`;
    }

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTickets(response.data);
  } catch (error) {
    console.error(
      "Error fetching tickets:",
      error
    );

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        alert(
          "Your login session has expired. Please log in again."
        );
      } else if (error.response?.status === 403) {
        alert(
          "You do not have permission to view tickets."
        );
      }
    }
  } finally {
    setLoading(false);
  }
};
  // =====================================================
  // FETCH TECHNICIANS
  // Admin only
  // =====================================================

  const fetchTechnicians = async () => {
    try {
      const token = getToken();
      const user = getUser();

      if (!token || user?.role !== "admin") {
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/auth/technicians`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTechnicians(response.data);
    } catch (error) {
      console.error(
        "Error fetching technicians:",
        error
      );
    }
  };

  // =====================================================
  // ASSIGN TECHNICIAN
  // Admin only
  // =====================================================

  const assignTechnician = async (
    ticketId: string,
    technicianId: string
  ) => {
    try {
      const token = getToken();
      const user = getUser();

      if (!token) {
        alert("You must be logged in.");
        return;
      }

      if (!user || user.role !== "admin") {
        alert(
          "Only administrators can assign technicians."
        );
        return;
      }

      if (!technicianId) {
        return;
      }

      setAssigning(ticketId);

      await axios.put(
        `${API_URL}/api/tickets/${ticketId}/assign`,
        {
          technicianId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Technician assigned successfully.");

      await fetchTickets();
    } catch (error) {
      console.error(
        "Error assigning technician:",
        error
      );

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert(
            "Your login session has expired. Please log in again."
          );
        } else if (error.response?.status === 403) {
          alert(
            "Only administrators can assign technicians."
          );
        } else {
          alert(
            error.response?.data?.message ||
              "Unable to assign technician."
          );
        }
      } else {
        alert("Unable to assign technician.");
      }
    } finally {
      setAssigning(null);
    }
  };

  // =====================================================
  // UPDATE STATUS
  // Admin and technician
  // =====================================================

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {
      const token = getToken();
      const user = getUser();

      if (!token) {
        alert("You must be logged in.");
        return;
      }

      if (
        !user ||
        (user.role !== "admin" &&
          user.role !== "technician")
      ) {
        alert(
          "Only administrators and technicians can change ticket status."
        );
        return;
      }

      await axios.put(
        `${API_URL}/api/tickets/${id}`,{
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchTickets();
    } catch (error) {
      console.error(
        "Error updating ticket status:",
        error
      );

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert(
            "Your login session has expired. Please log in again."
          );
        } else if (error.response?.status === 403) {
          alert(
            "Only administrators and technicians can change ticket status."
          );
        } else {
          alert(
            error.response?.data?.message ||
              "Unable to update ticket status."
          );
        }
      } else {
        alert("Unable to update ticket status.");
      }
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, [refresh]);

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>

        <h3>No tickets yet</h3>

        <p>
          There are currently no support tickets
          to display.
        </p>
      </div>
    );
  }

  const user = getUser();

  const canUpdateStatus =
    user?.role === "admin" ||
    user?.role === "technician";

  const isAdmin = user?.role === "admin";

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <article
          className="ticket-card"
          key={ticket._id}
        >
          <div className="ticket-header">
            <div>
              <span
                className={`priority-badge ${ticket.priority.toLowerCase()}`}
              >
                {ticket.priority}
              </span>

              <span
                className={`status-badge ${ticket.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {ticket.status}
              </span>
            </div>
          </div>

          <h3>{ticket.title}</h3>

          <p className="ticket-description">
            {ticket.description}
          </p>

          <div className="ticket-meta">
            <span>
              📁 {ticket.category}
            </span>

            <span>
              🆔 {ticket._id.slice(-6)}
            </span>

            {ticket.createdAt && (
              <span>
                📅{" "}
                {new Date(
                  ticket.createdAt
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* =====================================================
              ASSIGNED TECHNICIAN
              Admin only
          ===================================================== */}

          {isAdmin && (
            <div className="ticket-actions">
              <label
                htmlFor={`technician-${ticket._id}`}
              >
                Assigned Technician
              </label>

              <select
                id={`technician-${ticket._id}`}
                value={
                  ticket.assignedTo?._id || ""
                }
                disabled={
                  assigning === ticket._id
                }
                onChange={(e) =>
                  assignTechnician(
                    ticket._id,
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select technician
                </option>

                {technicians.map(
                  (technician) => (
                    <option
                      key={technician._id}
                      value={technician._id}
                    >
                      {technician.name}
                    </option>
                  )
                )}
              </select>

              {assigning === ticket._id && (
                <small>
                  Assigning technician...
                </small>
              )}

              {ticket.assignedTo && (
                <small>
                  Assigned to:{" "}
                  {ticket.assignedTo.name}
                </small>
              )}
            </div>
          )}

          {/* =====================================================
              UPDATE STATUS
              Admin and technician
          ===================================================== */}

          {canUpdateStatus && (
            <div className="ticket-actions">
              <label
                htmlFor={`status-${ticket._id}`}
              >
                Update status
              </label>

              <select
                id={`status-${ticket._id}`}
                value={ticket.status}
                onChange={(e) =>
                  updateStatus(
                    ticket._id,
                    e.target.value
                  )
                }
              >
                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="In Review">
                  In Review
                </option>

                <option value="Done">
                  Done
                </option>
              </select>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default TicketList;