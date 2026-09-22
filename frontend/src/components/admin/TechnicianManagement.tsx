import { useEffect, useState } from "react";
import axios from "axios";

interface Technician {
  _id: string;
  name: string;
  email: string;
  role: "technician";
}

function TechnicianManagement() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchTechnicians = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5001/api/auth/technicians",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Unable to load technicians."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  if (loading) {
    return (
      <section className="admin-section">
        <p>Loading technicians...</p>
      </section>
    );
  }

  return (
    <section className="admin-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>

          <h2>Technician Management</h2>

          <p>
            Manage technicians who can handle IT support tickets.
          </p>
        </div>
      </div>

      {technicians.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍💻</div>

          <h3>No technicians found</h3>

          <p>
            There are currently no technicians in the system.
          </p>
        </div>
      ) : (
        <div className="technician-list">
          {technicians.map((technician) => (
            <article
              className="technician-card"
              key={technician._id}
            >
              <div className="technician-avatar">
                👨‍💻
              </div>

              <div className="technician-info">
                <h3>{technician.name}</h3>

                <p>{technician.email}</p>

                <span className="status-badge">
                  TECHNICIAN
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TechnicianManagement;