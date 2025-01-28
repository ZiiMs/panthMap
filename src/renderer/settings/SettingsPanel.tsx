import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);

const SettingsPanel = () => {

  const [settings, setSettings] = useState<Config>({
    grabLocation: false,
    opacity: 0.7,
    width: 800,
    height: 600,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    window.settingsAPI.getSettings().then((settings) => {
      setSettings(settings);
      console.log(settings);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full bg-zinc-900 text-gray-400 overflow-hidden">
      <h1 className="text-xl font-bold py-1">Settings</h1>
      <div className="flex flex-col w-full justify-between gap-2 p-2">
        <div className="flex flex-row w-full items-start justify-between gap-1.5">
          <div className="flex flex-col w-fit items-start gap-1.5">
            <Label htmlFor="width">Width</Label>
            <Input type="number" id="width" placeholder="Width" className="w-24 w-full" value={settings.width} onChange={(e) => setSettings({ ...settings, width: parseInt(e.target.value) })} />
          </div>
          <div className="flex flex-col w-fit items-start gap-1.5">
            <Label htmlFor="height">Height</Label>
            <Input type="number" id="height" placeholder="height" className="w-24 w-full" value={settings.height} onChange={(e) => setSettings({ ...settings, height: parseInt(e.target.value) })} />
          </div>
        </div>
        <div className="flex flex-row w-full items-start justify-between gap-1.5">
          <div className="flex flex-col w-fit items-start gap-1.5">
            <Label htmlFor="x">X</Label>
            <Input type="number" id="x" placeholder="X" className="w-24 w-full" value={settings.x} onChange={(e) => setSettings({ ...settings, x: parseInt(e.target.value) })} />
          </div>
          <div className="flex flex-col w-fit items-start gap-1.5">
            <Label htmlFor="y">Y</Label>
            <Input type="number" id="y" placeholder="Y" className="w-24 w-full" value={settings.y} onChange={(e) => setSettings({ ...settings, y: parseInt(e.target.value) })} />
          </div>
        </div>
        <div className="flex flex-col w-full items-start justify-between gap-1.5">
          <Label htmlFor="opacity">Opacity</Label>
          <Slider.Root
            className="relative flex w-full touch-none select-none items-center"
            defaultValue={[0.7]}
            max={1}
            step={0.05}
            value={[settings.opacity]}
            onValueChange={(value) => setSettings({ ...settings, opacity: value[0] })}
          >
            <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-zinc-500/20">
              <Slider.Range className="absolute h-full bg-zinc-600" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-4 w-4 rounded-full border border-zinc-600/50 bg-zinc-900 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
          </Slider.Root>
        </div>

        <HoverCard>
          <HoverCardTrigger>
            <div className="flex flex-col w-full items-start justify-between gap-1.5">
              <Label htmlFor="opacity">Packet Listener (?)</Label>
              <div className="flex flex-col items-center justify-between gap-1.5">
                <Switch.Root
                  className={"peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-zinc-600 data-[state=unchecked]:bg-zinc-800"}
                  checked={settings.grabLocation}
                  onCheckedChange={(checked) => setSettings({ ...settings, grabLocation: checked })}
                >
                  <Switch.Thumb
                    className={cn(
                      "pointer-events-none block h-4 w-4 rounded-full bg-zinc-900 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
                    )} />
                </Switch.Root>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex flex-col items-start justify-between gap-1.5">
              <span className="text-xs space-y-1 gap-1 text-zinc-500">Enables a listener for incoming packets to look for /loc. It uses Tshark to capture packets. <span className="text-red-500/50 font-bold capitalize">(REQUIRES WIRESHARK)</span></span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex justify-between w-full p-2">
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-gray-400" onClick={() => {
          window.settingsAPI.setSettings(settings)
          window.settingsAPI.hideSettings()
          console.log('save')
        }}>Save</Button>
        <Button className="bg-zinc-600 hover:bg-zinc-700 text-gray-300 hover:text-gray-400" onClick={() => {
          window.settingsAPI.hideSettings()
        }}>Close</Button>
      </div>
    </div>

  );
}

root.render(<SettingsPanel />)