import React from 'react'
import {createRoot} from 'react-dom/client'
import './global.css'
import App from './App'
import { HashRouter, Routes, Route } from "react-router-dom";
import Setting from './Setting';
import { ThemeProvider } from './components/theme-provider';

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <HashRouter basename={"/"}>
                <Routes>
                    <Route path="/" element={<App/>} />
                    <Route path="/setting" element={<Setting/>} />
                </Routes>
            </HashRouter>
        </ThemeProvider>
    </React.StrictMode>
)
