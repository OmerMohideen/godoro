import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useEffect, useMemo, useState } from "react";
import { GetTime, GetTransition } from "../wailsjs/go/main/App";
import { Button } from "./components/ui/button";
import { RotateCcw, Settings } from "lucide-react";

export const tabs = ["focus", "break", "rest"];

function App() {
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [time, setTime] = useState(25 * 60);
    const updateTime = (result: number) => setTime(result);
    const [pause, setPause] = useState(true)
    const memoizedGetTime = useMemo(() => GetTime, []);
    const memorizedGetTransition = useMemo(() => GetTransition, []);
    const [pauseCounter, setPauseCounter] = useState(1)

    const clickTab = (timeType: string) => {
        memoizedGetTime(timeType).then(updateTime)
        setSelectedTab(timeType)
    }

    useEffect(() => {
        memoizedGetTime(tabs[0]).then(updateTime)
    }, [memoizedGetTime]);

    useEffect(() => {
        if (!pause) {
            let transition = false
            memorizedGetTransition().then((state: boolean) => { transition = state})
            const timer = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 0) {
                        const nextTabIndex = (tabs.indexOf(selectedTab) + 1) % tabs.length;
                        if (nextTabIndex === 0 || !transition) {
                            clearInterval(timer);
                            setPause(true);
                        } else if (pauseCounter < (2 * 4) - 1) {
                            if (pauseCounter % 2 == 1) {
                                memoizedGetTime(tabs[1]).then(updateTime);
                                setSelectedTab(tabs[1]);
                            } else {
                                memoizedGetTime(tabs[0]).then(updateTime);
                                setSelectedTab(tabs[0]);
                            }
                            setPauseCounter(pauseCounter+1)
                        } else {
                            setSelectedTab(tabs[2]);
                            memoizedGetTime(tabs[2]).then(updateTime);
                        }
                        return 0;
                    } else {
                        return prevTime - 1;
                    }
                });
            }, 1000); 
    
            return () => clearInterval(timer);
        }
    }, [pause, selectedTab, tabs, memoizedGetTime, pauseCounter]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <Tabs defaultValue={tabs[0]} className="w-full h-full grid bg-background">
            <TabsList className="flex justify-evenly p-0 h-[45px] align-middle bg-background">
                {tabs.map(tab => (
                    <TabsTrigger
                        key={tab}
                        className={`w-full bg-background rounded-none text-[16px] font-bold border-b-2 border-solid ${selectedTab === tab ? 'border-border-hint text-text' : 'border-border-subtle text-text-hint'}`}
                        value={tab}
                        onClick={
                            () => {
                                clickTab(tab); setPause(true)
                            }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                ))}
            </TabsList>
            <div className="w-full flex flex-col items-center">
                <div className="text-[64px] tracking-wide font-bold my-4 text-text">{formattedTime}</div>
                <div className="flex items-center justify-center gap-3 w-[192px] h-10">
                    <Button variant="ghost" size="icon" onClick={
                        () => clickTab(selectedTab)
                    }>
                        <RotateCcw className="scale-x-[-1] h-6 w-6 text-text-hint" />
                    </Button>
                    <Button className="rounded-lg w-[96px] h-[35px] text-md font-inter bg-text-primary text-text-inverse" onClick={() => setPause(!pause)}>
                        {pause ? "Start" : "Pause"}
                    </Button>
                    <a href="/#/setting">
                        <Button variant="ghost" size="icon">
                            <Settings className="h-6 w-6 text-text-hint" />
                        </Button>
                    </a>
                </div>
            </div>

        </Tabs>
    );
}

export default React.memo(App)
