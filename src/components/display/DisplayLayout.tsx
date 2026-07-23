"use client";

import { ReactNode, useEffect, useState } from "react";
import { Settings, Wifi } from "lucide-react";

import DisplaySettings from "./DisplaySettings";
import DisplayViewport from "./DisplayViewport";

type Props = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function DisplayLayout({
  title,
  children,
  footer,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <DisplayViewport>
        <div className="flex h-full flex-col bg-slate-950 text-white">

         {/* Header */}

         <header className="border-b border-slate-800 bg-slate-950">

            <div className="flex items-center justify-between px-10 py-6">

              <div>

                <div className="text-sm uppercase tracking-[0.35em] text-slate-400">
                 Aurora Outdoor Furniture
                </div>

                <h1 className="mt-2 text-4xl font-black">
                 {title}
                </h1>

              </div>

              <div className="flex items-center gap-8">

                <div className="flex items-center gap-3 text-xl text-green-400">

                  <Wifi className="h-5 w-5" />

                  Connected

                </div>

                <div className="text-6xl font-bold tracking-tight text-white">
                  {time}
                </div>

                <button
                 onClick={() => setSettingsOpen(true)}
                 className="rounded-xl p-3 transition hover:bg-slate-800"
                >
                 <Settings className="h-7 w-7" />
                </button>

              </div>

            </div>

          </header>

        {/* Main */}

        <main className="flex-1 overflow-hidden px-10 py-8">

          {children}

        </main>

        {/* Footer */}

        {footer && (
          <div className="px-10 pb-8">

            {footer}

          </div>
        )}

          </div>
      </DisplayViewport>

      <DisplaySettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </>
  );
}