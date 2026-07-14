"use client";

import { useEffect, useState } from "react";

export default function useLookup(url: string) {
  const [items, setItems] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setItems(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [url]);

  return { items, loading };
}