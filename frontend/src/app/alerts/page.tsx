"use client";

import { useState, useEffect } from 'react';

type Alert = {
  id: number;
  timestamp: string;
  rule_id: number;
  status: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
        try {
            const response = await fetch('/api/alerts');
            if(response.ok) {
                const data = await response.json();
                setAlerts(data);
            }
        } catch (error) {
            console.error("Failed to fetch alerts", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="bg-background-dark text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Alert Center</h1>
      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-white/80">Timestamp</th>
              <th className="px-4 py-3 text-sm font-medium text-white/80">Rule ID</th>
              <th className="px-4 py-3 text-sm font-medium text-white/80">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-white/80">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center p-4">Loading...</td></tr>
            ) : (
              alerts.map(alert => (
                <tr key={alert.id} className="hover:bg-white/5">
                  <td className="h-[72px] px-4 py-2">{new Date(alert.timestamp).toLocaleString()}</td>
                  <td className="h-[72px] px-4 py-2">{alert.rule_id}</td>
                  <td className="h-[72px] px-4 py-2">{alert.status}</td>
                  <td className="h-[72px] px-4 py-2">
                    <button className="font-bold text-primary hover:underline">View Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
