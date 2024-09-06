"use client";
import React, { useState, useEffect } from "react";
import WorldsList from "@/components/worlds/WorldsList";

export default function Worlds() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApps();
  }, []);

  const getApps = async () => {
    const response = await fetch("/api/apps");
    const data = await response.json();
    setApps(data);
    setLoading(false);
  };

  return (
    <div>
      <h1>Worlds</h1>
      {loading && <p>Loading...</p>}
      {apps && <WorldsList apps={apps} />}
    </div>
  );
}
