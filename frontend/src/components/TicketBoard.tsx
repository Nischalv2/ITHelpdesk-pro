import { useEffect, useState } from "react";
import axios from "axios";

interface Technician {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: Technician | null;
  createdAt?: string;
}

interface TicketBoardProps {
  refresh: boolean;
}

const columns = [
  "Open",
  "In Progress",
  "In Review",
  "Done",
];

function TicketBoard({ refresh }: TicketBoardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

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
        }

        if (error.response?.status === 403) {
          alert("You do not have permission to view tickets.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    ticketId: string,
    newStatus: string
  ) => {
    try {
      setUpdatingTicket(ticketId);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Your login session has expired. Please log in again.");
        return;
      }

      await axios.put(
        `https://ithelpdesk-pro.onrender.com/api/tickets/${ticketId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Your login session has expired. Please log in again.");
        } else if (error.response?.status === 403) {
          alert("You do not have permission to update this ticket.");
        } else {
          alert("Failed to update ticket status.");
        }
      } else {
        alert("Failed to update ticket status.");
      }
    } finally {
      setUpdatingTicket(null);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  if (loading) {
    return (
      <div className="loading">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="ticket-board">
      {columns.map((column) => {
        const columnTickets = tickets.filter(
          (ticket) => ticket.status === column
        );

        return (
          <div
            className="board-column"
            key={column}
          >
            <div className="board-column-header">
              <h3>{column}</h3>

              <span>
                {columnTickets.length}
              </span>
            </div>

            {columnTickets.map((ticket) => (
              <div
                className="board-ticket"
                key={ticket._id}
              >
                <span
                  className={`priority-badge ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>

                <h4>{ticket.title}</h4>

                <p>{ticket.description}</p>

                <small>
                  📁 {ticket.category}
                </small>

                {ticket.assignedTo && (
                  <small>
                    👤 {ticket.assignedTo.name}
                  </small>
                )}

                <select
                  value={ticket.status}
                  onChange={(event) =>
                    updateStatus(ticket._id, event.target.value)
                  }
                  disabled={updatingTicket === ticket._id}
                >
                  {columns.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {updatingTicket === ticket._id && (
                  <small>
                    Updating...
                  </small>
                )}
              </div>
            ))}

            {columnTickets.length === 0 && (
              <div className="board-empty">
                No tickets
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TicketBoard;
