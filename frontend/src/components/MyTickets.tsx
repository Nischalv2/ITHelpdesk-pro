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
  createdAt?: string;
}

interface Props {
  refresh: boolean;
}

function MyTickets({ refresh }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setTickets([]);
        return;
      }

      const response = await axios.get(
        "https://ithelpdesk-pro.onrender.com/api/tickets/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching my tickets:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Your login session has expired. Please log in again.");
        } else if (error.response?.status === 403) {
          alert("You do not have permission to view these tickets.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [refresh]);

  if (loading) {
    return <p>Loading your tickets...</p>;
  }

  if (tickets.length === 0) {
    return (
      <section className="my-tickets-section">
        <div className="empty-state">
          <div className="empty-icon">📭</div>

          <h3>No tickets yet</h3>

          <p>
            You haven't submitted any support tickets yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-tickets-section">
      <div className="section-header">
        <div>
          <h2>My Tickets</h2>

          <p>
            View the support requests you have submitted.
          </p>
        </div>
      </div>

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

            <div className="ticket-assignment">
              <strong>Assigned Technician:</strong>{" "}
              {ticket.assignedTo
                ? ticket.assignedTo.name
                : "Not assigned yet"}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyTickets;