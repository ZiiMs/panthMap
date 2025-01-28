import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
root.render(
  <button className="bg-zinc-800 p-2 hover:bg-zinc-700 text-gray-400 hover:text-gray-400 rounded-full" onClick={() => {
    window.settingsAPI.getIsSettingsVisible().then((isVisible) => {
      if (isVisible) {
        window.settingsAPI.hideSettings();
      } else {
        window.settingsAPI.showSettings();
      }
    })
  }}>
    <Settings size={26} />
  </button>
);
