import { useState } from "react";
import TicketList from "./components/TicketList";
import CreateTicket from "./components/CreateTicket";
import TicketBoard from "./components/TicketBoard";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState<"list" | "board">("list");

  const handleTicketCreated = () => {
    setRefresh((current) => !current);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>ITHelpdesk-pro 🚀</h1>
          <p>IT Support Ticket Management</p>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Local System Online
        </div>
      </header>

      <main className="app-content">
        <section className="hero-section">
          <div>
            <span className="eyebrow">IT SUPPORT</span>
            <h2>Manage your helpdesk tickets</h2>
            <p>
              Create, track and update support tickets from one dashboard.
            </p>
          </div>

          <div className="hero-icon">🎫</div>
        </section>

        <CreateTicket onCreated={handleTicketCreated} />

        <section className="ticket-section">
          <div className="section-header">
            <div>
              <h2>Helpdesk Tickets</h2>
              <p>View and manage your current support requests.</p>
            </div>

            <div className="view-buttons">
              <button
                className={view === "list" ? "view-button active" : "view-button"}
                onClick={() => setView("list")}
              >
                ☰ List
              </button>

              <button
                className={view === "board" ? "view-button active" : "view-button"}
                onClick={() => setView("board")}
              >
                ▦ Board
              </button>
            </div>
          </div>

          {view === "list" ? (
            <TicketList refresh={refresh} />
          ) : (
            <TicketBoard refresh={refresh} />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>ITHelpdesk-pro • Local Development Environment</p>
      </footer>
    </div>
  );
}

export default App;