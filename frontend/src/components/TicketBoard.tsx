import { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
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

  return (
    <div className="board">
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