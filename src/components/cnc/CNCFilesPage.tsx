"use client";

import { useEffect, useMemo, useState } from "react";

import CNCSearch from "./CNCSearch";
import CNCFileList, { CNCFile } from "./CNCFileList";

export default function CNCFilesPage() {
  const [files, setFiles] = useState<CNCFile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch("/api/cnc-files");
        const data = await res.json();

        setFiles(data);
      } catch (err) {
        console.error("Unable to load CNC files.", err);
      }
    }

    loadFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    const searchLower = search.toLowerCase();

    return files.filter(
      (file) =>
        file.part.toLowerCase().includes(searchLower) ||
        file.file.toLowerCase().includes(searchLower)
    );
  }, [files, search]);

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          CNC Files
        </h1>

        <p className="mt-2 text-slate-400">
          Search and download CNC files.
        </p>

      </div>

      <CNCSearch
        value={search}
        onChange={setSearch}
      />

      <CNCFileList
        files={filteredFiles}
      />

    </div>
  );
}