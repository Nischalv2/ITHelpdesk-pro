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
                    👤 {ticket.assignedTo}
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