package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"
)

type App struct {
	ctx    context.Context
	config Config
}

func NewApp() *App {
	return &App{
		config: Config{
			DarkMode:       false,
			AutoTransition: true,
			FocusTimer:     25,
			BreakTimer:     5,
			RestTimer:      15,
		},
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.loadConfig()
}

type Config struct {
	DarkMode       bool `json:"darkMode"`
	AutoTransition bool `json:"autoTransition"`
	FocusTimer     int  `json:"focusTimer"`
	BreakTimer     int  `json:"breakTimer"`
	RestTimer      int  `json:"restTimer"`
}

func (a *App) loadConfig() error {
	if err := makePath(); err != nil {
		return err
	}
	savePath := getSavePath()
	data, err := ioutil.ReadFile(filepath.Join(savePath, "settings.json"))
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &a.config)
}

func (a *App) SaveConfig() error {
	if err := makePath(); err != nil {
		return err
	}
	savePath := getSavePath()
	data, err := json.MarshalIndent(a.config, "", "  ")
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(filepath.Join(savePath, "settings.json"), data, 0644)
	return err
}

func makePath() error {
	dirPath := getSavePath()
	if _, err := os.Stat(dirPath); os.IsNotExist(err) {
		err := os.MkdirAll(dirPath, 0755)
		if err != nil {
			return err
		}
	}
	return nil
}

func getSavePath() string {
	path, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(path, "Documents", "Godoro")
}

func (a *App) GetTime(timeType string) int {
	switch timeType {
	case "focus":
		return a.config.FocusTimer * 60
	case "break":
		return a.config.BreakTimer * 60
	case "rest":
		return a.config.RestTimer * 60
	}
	return a.config.FocusTimer * 60
}

func (a *App) SetTime(timeType string, time int) {
	switch timeType {
	case "focus":
		a.config.FocusTimer = time
	case "break":
		a.config.BreakTimer = time
	case "rest":
		a.config.RestTimer = time
	}
}

func (a *App) SetDarkMode(darkMode bool) {
	a.config.DarkMode = darkMode
}

func (a *App) GetDarkMode() bool {
	return a.config.DarkMode
}

func (a *App) SetTransition(transition bool) {
	a.config.AutoTransition = transition
}

func (a *App) GetTransition() bool {
	return a.config.AutoTransition
}
