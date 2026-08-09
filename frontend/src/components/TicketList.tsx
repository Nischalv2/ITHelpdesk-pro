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

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5001/api/tickets"
      );

      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await axios.put(
        `http://localhost:5001/api/tickets/${id}`,
        {
          status,
        }
      );

      await fetchTickets();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Unable to update ticket status.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  if (loading) {
    return (
      <div className="loading-card">
        Loading tickets...
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No tickets yet</h3>
        <p>Create your first support ticket above.</p>
      </div>
    );
  }

  return (
    <div className="ticket-grid">
      {tickets.map((ticket) => (
        <article
          className="ticket-card"
          key={ticket._id}
        >
          <div className="ticket-card-top">
            <span
              className={`priority-badge ${ticket.priority.toLowerCase()}`}
            >
              {ticket.priority}
            </span>

            <span
              className={`status-badge ${ticket.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {ticket.status}
            </span>
          </div>

          <h3>{ticket.title}</h3>

          <p className="ticket-description">
            {ticket.description}
          </p>

          <div className="ticket-meta">
            <span>📁 {ticket.category}</span>

            <span>
              🆔 {ticket._id.slice(-6)}
            </span>
          </div>

          <div className="ticket-actions">
            <label htmlFor={`status-${ticket._id}`}>
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
              <option value="Open">Open</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="In Review">
                In Review
              </option>
              <option value="Done">Done</option>
            </select>
          </div>
        </article>
      ))}
    </div>
  );
}

export default TicketList;