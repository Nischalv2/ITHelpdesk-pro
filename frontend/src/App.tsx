import { useState } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import TicketList from "./components/TicketList";
import CreateTicket from "./components/CreateTicket";
import TicketBoard from "./components/TicketBoard";
import TechnicianManagement from "./components/admin/TechnicianManagement";
import MyTickets from "./components/MyTickets";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "technician" | "user";
};

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [showRegister, setShowRegister] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState<"list" | "board">("list");

  const handleLogin = (
    loggedInUser: User,
    token: string
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const handleTicketCreated = () => {
    setRefresh((current) => !current);
  };

  if (!user) {
    if (showRegister) {
      return (
        <div>
          <Register
            onRegistered={() => setShowRegister(false)}
          />

          <button
            className="auth-switch-button"
            onClick={() => setShowRegister(false)}
          >
            Already have an account? Login
          </button>
        </div>
      );
    }

    return (
      <div>
        <Login
          onLogin={handleLogin}
        />

        <button
          className="auth-switch-button"
          onClick={() => setShowRegister(true)}
        >
          Don't have an account? Register
        </button>
      </div>
    );
  }

  const canViewTickets =
    user.role === "admin" ||
    user.role === "technician";

  return (
    <div className="app-shell">

      <header className="app-header">
        <div>
          <h1>ITHelpdesk-pro 🚀</h1>
          <p>IT Support Ticket Management</p>
        </div>

        <div className="header-right">

          <div className="user-info">
            <strong>{user.name}</strong>
            <span>
              {user.role.toUpperCase()}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

          <div className="header-status">
            <span className="status-dot"></span>
            System Online
          </div>

        </div>
      </header>

      <main className="app-content">

        <section className="hero-section">
          <div>
            <span className="eyebrow">
              IT SUPPORT
            </span>

            <h2>
              Welcome, {user.name}
            </h2>

            <p>
              {user.role === "user"
                ? "Submit a support request and our IT team will assist you."
                : "Manage and resolve IT support tickets."}
            </p>
          </div>

          
        </section>

        <CreateTicket
          onCreated={handleTicketCreated}
        />
        {user.role === "user" && (
  <MyTickets
    refresh={refresh}
  />
)}

        {canViewTickets && (
          <section className="ticket-section">

            <div className="section-header">

              <div>
                <h2>
                  Helpdesk Tickets
                </h2>

                <p>
                  View and manage current support requests.
                </p>
              </div>

              <div className="view-buttons">

                <button
                  className={
                    view === "list"
                      ? "view-button active"
                      : "view-button"
                  }
                  onClick={() =>
                    setView("list")
                  }
                >
                  ☰ List
                </button>

                <button
                  className={
                    view === "board"
                      ? "view-button active"
                      : "view-button"
                  }
                  onClick={() =>
                    setView("board")
                  }
                >
                  ▦ Board
                </button>

              </div>

            </div>

            {view === "list" ? (
              <TicketList
                refresh={refresh}
              />
            ) : (
              <TicketBoard
                refresh={refresh}
              />
            )}

          </section>
        )}
            {user.role === "admin" && (
      <TechnicianManagement />
    )}

    {user.role === "user" && (
      <section className="user-notice">
        <h3>Ticket submitted to IT Support</h3>

        <p>
          Your request has been sent to the IT
          support team. A technician or administrator
          will handle it.
        </p>
      </section>
    )}

      </main>

      <footer className="app-footer">
        <p>
          ITHelpdesk-pro • Secure IT Support System
        </p>
      </footer>

    </div>
  );
}

export default App;