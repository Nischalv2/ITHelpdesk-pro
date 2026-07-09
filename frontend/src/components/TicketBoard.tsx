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

const columns = [
  "Open",
  "In Progress",
  "In Review",
  "Done"
];

function TicketBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/tickets"
      );

      setTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{
      display: "flex",
      gap: "20px"
    }}>

      {columns.map((column) => (
        <div
          key={column}
          style={{
            width: "250px",
            border: "1px solid gray",
            padding: "10px"
          }}
        >

          <h3>{column}</h3>

          {tickets
            .filter(ticket => ticket.status === column)
            .map(ticket => (

              <div
                key={ticket._id}
                style={{
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  padding: "10px"
                }}
              >

                <h4>{ticket.title}</h4>

                <p>{ticket.description}</p>

                <small>
                  {ticket.category} | {ticket.priority}
                </small>

              </div>

          ))}

        </div>
      ))}

    </div>
  );
}

export default TicketBoard;