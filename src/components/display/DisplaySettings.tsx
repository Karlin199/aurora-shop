"use client";

import {
  Home,
  Monitor,
  RotateCcw,
  RotateCw,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useDisplaySettings } from "./DisplayContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DisplaySettings({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const {
    settings,
    updateSettings,
    resetSettings,
  } = useDisplaySettings();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">

      <div className="flex h-full w-full max-w-xl flex-col bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-700 px-8 py-6">

          <div className="flex items-center gap-3">

            <Monitor className="h-7 w-7 text-blue-400" />

            <h2 className="text-3xl font-bold">
              Display Settings
            </h2>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-800"
          >
            <X className="h-7 w-7" />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 space-y-10 overflow-y-auto p-8">

          {/* Appearance */}

          <section>

            <h3 className="mb-5 text-xl font-semibold">
              Appearance
            </h3>

            <Setting label="Text Size">

              <select
                value={settings.textPreset}
                onChange={(e) =>
                  updateSettings({
                    textPreset: e.target
                      .value as
                      | "Large"
                      | "Extra Large"
                      | "Massive",
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
              >
                <option>Large</option>
                <option>Extra Large</option>
                <option>Massive</option>
              </select>

            </Setting>

            <Setting label="Text Scale">

              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.05"
                value={settings.textScale}
                onChange={(e) =>
                  updateSettings({
                    textScale: Number(e.target.value),
                  })
                }
                className="w-full"
              />

            </Setting>

            <Setting label="Theme">

              <select
                value={settings.theme}
                onChange={(e) =>
                  updateSettings({
                    theme: e.target
                      .value as "Dark" | "Light",
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
              >
                <option>Dark</option>
                <option>Light</option>
              </select>

            </Setting>

          </section>

          {/* Orders */}

          <section>

            <h3 className="mb-5 text-xl font-semibold">
              Orders
            </h3>

            <Setting label="Customers to Show">

              <select
                value={settings.customersToShow}
                onChange={(e) =>
                  updateSettings({
                    customersToShow: Number(
                      e.target.value
                    ),
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={9999}>All</option>
              </select>

            </Setting>

            <Toggle
              label="Show Customer"
              checked={settings.showCustomer}
              onChange={(checked) =>
                updateSettings({
                  showCustomer: checked,
                })
              }
            />

            <Toggle
              label="Show Due Date"
              checked={settings.showDueDate}
              onChange={(checked) =>
                updateSettings({
                  showDueDate: checked,
                })
              }
            />

            <Toggle
              label="Show Status"
              checked={settings.showStatus}
              onChange={(checked) =>
                updateSettings({
                  showStatus: checked,
                })
              }
            />

            <Toggle
              label="Show Order Number"
              checked={settings.showOrderNumber}
              onChange={(checked) =>
                updateSettings({
                  showOrderNumber: checked,
                })
              }
            />

          </section>

          {/* Behavior */}

          <section>

            <h3 className="mb-5 text-xl font-semibold">
              Behavior
            </h3>

            <Setting label="Refresh Interval">

              <select
                value={settings.refresh}
                onChange={(e) =>
                  updateSettings({
                    refresh: Number(
                      e.target.value
                    ) as 15 | 30 | 60,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
              >
                <option value={15}>
                  15 Seconds
                </option>

                <option value={30}>
                  30 Seconds
                </option>

                <option value={60}>
                  60 Seconds
                </option>

              </select>

            </Setting>

            <Toggle
              label="Auto Advance"
              checked={settings.autoAdvance}
              onChange={(checked) =>
                updateSettings({
                  autoAdvance: checked,
                })
              }
            />

            <Toggle
              label="Highlight Overdue"
              checked={settings.highlightOverdue}
              onChange={(checked) =>
                updateSettings({
                  highlightOverdue: checked,
                })
              }
            />

          </section>

        </div>

        {/* Footer */}

        <div className="space-y-4 border-t border-slate-700 p-8">

          <button
            onClick={resetSettings}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-700 px-5 py-4 font-semibold transition hover:bg-slate-600"
          >
            <RotateCcw className="h-5 w-5" />
            Reset to Defaults
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-800 px-5 py-4 font-semibold transition hover:bg-slate-700"
          >
            <RotateCw className="h-5 w-5" />
            Reload Display
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-700"
          >
            <Home className="h-5 w-5" />
            Return to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

function Setting({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-slate-300">
        {label}
      </label>

      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="mb-3 flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-4 py-3">

      <span>{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="h-5 w-5"
      />

    </label>
  );
}