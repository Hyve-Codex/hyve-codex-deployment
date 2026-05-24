import type { Command } from '@/types'

export const commands: Command[] = [
  // ── Claude Web App ────────────────────────────────────────────────────────
  {
    id: 1,
    category: 'Claude Web App',
    keys: 'Ctrl+Enter (Win) / Cmd+Enter (Mac)',
    description: 'Send message',
    platform: 'all',
  },
  {
    id: 2,
    category: 'Claude Web App',
    keys: 'Shift+Enter',
    description: 'Add a new line without sending the message',
    platform: 'all',
  },
  {
    id: 3,
    category: 'Claude Web App',
    keys: '↑ Arrow Key',
    description: 'Edit your last message',
    platform: 'all',
  },
  {
    id: 4,
    category: 'Claude Web App',
    keys: 'Ctrl+/ (Win) / Cmd+/ (Mac)',
    description: 'Open keyboard shortcuts reference',
    platform: 'all',
  },
  {
    id: 5,
    category: 'Claude Web App',
    keys: 'Ctrl+Shift+; (Win) / Cmd+Shift+; (Mac)',
    description: 'Start a new conversation',
    platform: 'all',
  },
  {
    id: 6,
    category: 'Claude Web App',
    keys: 'Ctrl+K (Win) / Cmd+K (Mac)',
    description: 'Open the search bar to find past conversations',
    platform: 'all',
  },

  // ── Claude Code (Terminal) ────────────────────────────────────────────────
  {
    id: 7,
    category: 'Claude Code (Terminal)',
    keys: '/',
    description: 'Open the commands menu inside a Claude Code session',
    platform: 'all',
  },
  {
    id: 8,
    category: 'Claude Code (Terminal)',
    keys: 'Escape',
    description: 'Cancel the current Claude Code action or generation',
    platform: 'all',
  },
  {
    id: 9,
    category: 'Claude Code (Terminal)',
    keys: 'Ctrl+C',
    description: 'Stop a running process or generation in the terminal',
    platform: 'all',
  },
  {
    id: 10,
    category: 'Claude Code (Terminal)',
    keys: 'claude --help',
    description: 'Show all available Claude Code CLI commands and flags',
    platform: 'all',
  },
  {
    id: 11,
    category: 'Claude Code (Terminal)',
    keys: 'claude --continue',
    description: 'Continue the most recent Claude Code conversation',
    platform: 'all',
  },
  {
    id: 12,
    category: 'Claude Code (Terminal)',
    keys: 'claude --resume',
    description: 'Select and resume a previous Claude Code conversation',
    platform: 'all',
  },

  // ── Browser Shortcuts ─────────────────────────────────────────────────────
  {
    id: 13,
    category: 'Browser Shortcuts',
    keys: 'Ctrl+L (Win) / Cmd+L (Mac)',
    description: 'Focus the address bar, useful for navigating to Claude.ai quickly',
    platform: 'all',
  },
  {
    id: 14,
    category: 'Browser Shortcuts',
    keys: 'Ctrl+T (Win) / Cmd+T (Mac)',
    description: 'Open a new browser tab',
    platform: 'all',
  },
  {
    id: 15,
    category: 'Browser Shortcuts',
    keys: 'Ctrl+Shift+J (Win) / Cmd+Option+J (Mac)',
    description: 'Open browser developer console, useful for debugging Claude-powered tools',
    platform: 'all',
  },
]

export const commandCategories = [...new Set(commands.map(c => c.category))]
