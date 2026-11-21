
import { useEffect, useState } from "react";
import "./App.css";

type HealthResponse = {
  success: boolean;
  service: string;
  status: string;
  timestamp: string;
};

function App() {
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkBackendHealth() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/health`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Backend health check failed");
        }

        const data: HealthResponse = await response.json();

        setApiStatus(data.status);
        setLastChecked(data.timestamp);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Health check error:", error);
        setApiStatus("unavailable");
      }
    }

    checkBackendHealth();

    return () => controller.abort();
  }, []);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>DeployGuard</h1>
        <p>Progressive Delivery Control Plane</p>
      </header>

      <section className="status-card">
        <h2>System Overview</h2>

        <div className="status-row">
          <span>Backend API</span>

          <span
            className={
              apiStatus === "healthy"
                ? "status healthy"
                : "status unhealthy"
            }
          >
            {apiStatus}
          </span>
        </div>

        <div className="status-row">
          <span>Last Checked</span>
          <span>
            {lastChecked
              ? new Date(lastChecked).toLocaleString()
              : "Not available"}
          </span>
        </div>
      </section>
    </main>
  );
}

export default App;
