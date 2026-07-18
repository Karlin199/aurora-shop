"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type DisplaySettings = {
  // Appearance
  textPreset: "Large" | "Extra Large" | "Massive";
  textScale: number;
  theme: "Dark" | "Light";

  // Behavior
  refresh: 15 | 30 | 60;
  autoAdvance: boolean;
  highlightOverdue: boolean;

  // Orders
  showCustomer: boolean;
  showDueDate: boolean;
  showStatus: boolean;
  showOrderNumber: boolean;
  showOverviewCard: boolean;
  customersToShow: number;
};

const DEFAULT_SETTINGS: DisplaySettings = {
  // Appearance
  textPreset: "Extra Large",
  textScale: 1.15,
  theme: "Dark",

  // Behavior
  refresh: 30,
  autoAdvance: true,
  highlightOverdue: true,

  // Orders
  showCustomer: true,
  showDueDate: true,
  showStatus: true,
  showOrderNumber: true,
  showOverviewCard: true,
  customersToShow: 10,
};

type ContextType = {
  settings: DisplaySettings;

  updateSettings: (
    updates: Partial<DisplaySettings>
  ) => void;

  resetSettings: () => void;
};

const DisplayContext = createContext<
  ContextType | undefined
>(undefined);

const STORAGE_KEY = "aurora-display-settings";

export function DisplayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<DisplaySettings>(DEFAULT_SETTINGS);

  // Load saved settings

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      });
    } catch {
      console.warn(
        "Unable to load display settings."
      );
    }
  }, []);

  // Save helper

  function save(settings: DisplaySettings) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  }

  function updateSettings(
    updates: Partial<DisplaySettings>
  ) {
    setSettings((current) => {
      const updated = {
        ...current,
        ...updates,
      };

      save(updated);

      return updated;
    });
  }

  function resetSettings() {
    save(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <DisplayContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
}

export function useDisplaySettings() {
  const context = useContext(DisplayContext);

  if (!context) {
    throw new Error(
      "useDisplaySettings must be used inside DisplayProvider."
    );
  }

  return context;
}

export function useDisplayScale() {
  const { settings } = useDisplaySettings();

  return {
    scale: settings.textScale,

    heading: `${3.25 * settings.textScale}rem`,
    title: `${2.5 * settings.textScale}rem`,
    subtitle: `${1.75 * settings.textScale}rem`,
    body: `${1.25 * settings.textScale}rem`,
    small: `${1.0 * settings.textScale}rem`,

    spacing: 1 * settings.textScale,
  };
}