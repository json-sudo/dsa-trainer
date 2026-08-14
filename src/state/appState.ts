import { useSyncExternalStore } from 'react'
import {
  loadState,
  saveState,
  loadSettings,
  saveSettings,
  type AppState,
  type Attempt,
  type Settings,
} from '../lib/store'

type Listener = () => void

let state: AppState = loadState()
let settings: Settings = loadSettings()
const listeners = new Set<Listener>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getAppState(): AppState {
  return state
}

export function getSettings(): Settings {
  return settings
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getAppState)
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSettings)
}

export function setTheme(theme: 'light' | 'dark') {
  settings = { ...settings, theme }
  saveSettings(settings)
  document.documentElement.classList.toggle('dark', theme === 'dark')
  emit()
}

export function applyThemeClass() {
  document.documentElement.classList.toggle('dark', settings.theme === 'dark')
}

/** Insert or update an attempt (drafts included), then persist. */
export function upsertAttempt(attempt: Attempt) {
  const idx = state.attempts.findIndex((a) => a.id === attempt.id)
  const attempts = [...state.attempts]
  if (idx >= 0) attempts[idx] = attempt
  else attempts.push(attempt)
  state = { ...state, attempts }
  saveState(state)
  emit()
}

export function removeAttempt(id: string) {
  state = { ...state, attempts: state.attempts.filter((a) => a.id !== id) }
  saveState(state)
  emit()
}

/** Replace the whole state (import / reset). */
export function replaceState(next: AppState) {
  state = next
  saveState(state)
  emit()
}

export function reloadFromStorage() {
  state = loadState()
  settings = loadSettings()
  emit()
}
