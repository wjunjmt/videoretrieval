"use client";

import { useState, useEffect } from 'react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
        try {
            const response = await fetch('/api/alerts');
            if(response.ok) setAlerts(await response.json());
        } finally {
            setIsLoading(false);
        }
    };
    fetchAlerts();
  }, []);

  // ... (JSX for rendering the table remains the same)
  return (
      <main className="flex flex-1 overflow-hidden bg-background-dark text-white">
          {/* ... */}
      </main>
  );
}
