import { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: string;
  createdAt?: string;
}

interface Props {
  refresh: boolean;
}

function TicketList({ refresh }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        console.error("No authentication token found.");
        setTickets([]);
        return;
      }

      const response = await axios.get(
        "https://ithelpdesk-pro.onrender.com/api/tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Your login session has expired. Please log in again.");
        } else if (error.response?.status === 403) {
          alert("You do not have permission to view tickets.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

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
        (user.role !== "admin" && user.role !== "technician")
      ) {
        alert("Only administrators and technicians can change ticket status.");
        return;
      }

      await axios.put(
        `https://ithelpdesk-pro.onrender.com/api/tickets/${id}`,
        {
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
      console.error("Error updating ticket status:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Your login session has expired. Please log in again.");
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

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  if (loading) {
    return (
      <div className="loading-state">
        Loading tickets...
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>

        <h3>No tickets yet</h3>

        <p>
          There are currently no support tickets to display.
        </p>
      </div>
    );
  }

  const user = getUser();

  const canUpdateStatus =
    user?.role === "admin" ||
    user?.role === "technician";

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <article
          className="ticket-card"
          key={ticket._id}
        >
          <div className="ticket-card-header">
            <div className="ticket-badges">
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