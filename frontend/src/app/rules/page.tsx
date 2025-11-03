"use client";

import { useState, useEffect } from 'react';

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
        try {
            const response = await fetch('/api/alerts/rules');
            if(response.ok) setRules(await response.json());
        } finally {
            setIsLoading(false);
        }
    };
    fetchRules();
  }, []);

  // ... (JSX for rendering the table and modal remains the same)
  return (
      <div className="flex h-screen w-full bg-background-dark text-white">
          {/* ... */}
      </div>
  );
}
