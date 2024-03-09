import { ChevronLeft } from "lucide-react"
import { Button } from "./components/ui/button"
import { Label } from "./components/ui/label"
import { Checkbox } from "./components/ui/checkbox"
import { Input } from "./components/ui/input"
import { tabs } from "./App"
import Switch from "./components/switch"
import React, { useEffect, useState, useCallback } from "react"
import { GetTime, GetDarkMode, GetTransition, SaveConfig, SetTime, SetDarkMode, SetTransition } from "../wailsjs/go/main/App"
import { useTheme } from "@/components/theme-provider"

function Setting() {
    const { setTheme } = useTheme()

    const [darkmode, setDarkmode] = useState(false)
    const [transition, setTransition] = useState(true)
    const [focusTime, setFocus] = useState(30)
    const [breakTime, setBreak] = useState(5)
    const [restTime, setRest] = useState(15)

    const handleDarkmode = () => {
        setDarkmode(!darkmode)
        setTheme(darkmode ? 'light' : 'dark')
    }

    const handleTransition = () => {
        setTransition(!transition)
    }

    const setTime = useCallback((id: string, value: number) => {
        let newValueInMinutes = value
        if (value > 1) {
            newValueInMinutes = Math.max(value, 1) / 60; 
        }
        switch (id) {
            case "focus":
                setFocus(newValueInMinutes);
                break;
            case "break":
                setBreak(newValueInMinutes);
                break;
            case "rest":
                setRest(newValueInMinutes);
                break;
        }
    }, [setFocus, setBreak, setRest]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setTime(id, parseFloat(value) * 60);
    }, [setTime]);

    const getTime = useCallback((tab: string): number => {
        switch (tab) {
            case "focus":
                return focusTime;
            case "break":
                return breakTime;
            case "rest":
                return restTime;
            default:
                return 0;
        }
    }, [focusTime, breakTime, restTime]);

    useEffect(() => {
        const fetchData = async () => {
            for (const tab of tabs) {
                const time = await GetTime(tab);
                setTime(tab, time);
            }
            const darkmode = await GetDarkMode();
            setDarkmode(darkmode)
            const transition = await GetTransition();
            setTransition(transition)
        };
        fetchData();
    }, [tabs, setTime]);

    const saveSettings= () => {
        tabs.forEach((tab) => {
            SetTime(tab, getTime(tab))
        })
        SetDarkMode(darkmode)
        SetTransition(transition)
        SaveConfig()
    }

    return (
        <div className="drag">
            <div className="bg-background border-b-2 border-paper h-12 flex items-center justify-start">
                <a href="/" onClick={saveSettings}>
                    <Button variant="ghost" className="font-inter text-[16px] text-text">
                        <ChevronLeft className="mr-2 w-4 h-4 text-text-hint" /> Settings
                    </Button>
                </a>
            </div>
            <div className="grid grid-rows-3 w-full h-full items-start px-6 pt-4 pb-6">
                <div className="flex items-center gap-2">
                    <Switch variant="outline" id="airplane-mode" darkmode={darkmode} onClick={handleDarkmode} />
                    <Label htmlFor="airplane-mode" className="text-text">{darkmode ? 'Dark' : 'Light'} mode</Label>
                </div>
                <div className="flex items-center gap-2 pt-3">
                    <Checkbox id="auto-transition" className="h-6 w-6 text-lg" checked={transition} onClick={handleTransition} />
                    <Label htmlFor="auto-transition" className="text-text">Auto-transition timer</Label>
                </div>
                <div className="grid grid-cols-3 gap-2 text-text">
                    {tabs.map(tab => (
                        <div key={tab} className="grid w-full max-w-sm items-center gap-3.5">
                            <Label htmlFor={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Label>
                            <Input type="number" className="h-[27px] w-[110px] rounded-sm bg-paper border-none focus-visible:ring-1 focus-visible:ring-offset-0" id={tab} value={getTime(tab)} onChange={handleInputChange} min={1} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Setting