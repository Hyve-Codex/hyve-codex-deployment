'use client'

import { useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronDown, User, CreditCard, HelpCircle } from 'lucide-react'
import { prompts, promptCategories } from '@/lib/data/prompts'
import { skills, skillCategories } from '@/lib/data/skills'
import { commands, commandCategories } from '@/lib/data/commands'
import { tools, toolCategories } from '@/lib/data/tools'
import LogoutButton from '@/components/shared/LogoutButton'

type SidebarItem =
  | { type: 'all'; label: string; count: number }
  | { type: 'group'; label: string; count: number; children: { label: string; count: number }[] }

function buildPromptItems(): SidebarItem[] {
  const items: SidebarItem[] = [{ type: 'all', label: 'All Prompts', count: prompts.length }]
  promptCategories.forEach(cat => {
    const catPrompts = prompts.filter(p => p.category === cat)
    const subcats = [...new Set(catPrompts.map(p => p.subcategory))]
    items.push({
      type: 'group',
      label: cat,
      count: catPrompts.length,
      children: subcats.map(sub => ({
        label: sub,
        count: catPrompts.filter(p => p.subcategory === sub).length,
      })),
    })
  })
  return items
}

function buildSimpleItems(
  label: string,
  all: { category: string }[],
  cats: string[]
): SidebarItem[] {
  return [
    { type: 'all', label: `All ${label}`, count: all.length },
    ...cats.map(cat => ({
      type: 'group' as const,
      label: cat,
      count: all.filter(i => i.category === cat).length,
      children: [],
    })),
  ]
}

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const activeCategory = searchParams.get('category')
  const activeSubcategory = searchParams.get('subcategory')

  const isAccount = pathname.startsWith('/dashboard/account')
  const isPrompts = pathname.startsWith('/dashboard/prompts')
  const isSkills = pathname.startsWith('/dashboard/skills')
  const isCommands = pathname.startsWith('/dashboard/commands')
  const isTools = pathname.startsWith('/dashboard/tools')

  const basePath = isPrompts
    ? '/dashboard/prompts'
    : isSkills
    ? '/dashboard/skills'
    : isCommands
    ? '/dashboard/commands'
    : isTools
    ? '/dashboard/tools'
    : null

  const items: SidebarItem[] = isPrompts
    ? buildPromptItems()
    : isSkills
    ? buildSimpleItems('Skills', skills, skillCategories)
    : isCommands
    ? buildSimpleItems('Commands', commands, commandCategories)
    : isTools
    ? buildSimpleItems('Tools', tools, toolCategories)
    : []

  function navigate(category?: string, subcategory?: string) {
    if (!basePath) return
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (subcategory) params.set('subcategory', subcategory)
    const qs = params.toString()
    router.push(qs ? `${basePath}?${qs}` : basePath)
  }

  function toggleGroup(label: string) {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  // Account sidebar
  if (isAccount) {
    const ACCOUNT_LINKS = [
      { label: 'Profile', href: '#profile', icon: User },
      { label: 'Subscription', href: '#subscription', icon: CreditCard },
      { label: 'Help', href: '#help', icon: HelpCircle },
    ]
    return (
      <aside
        className="fixed left-0 bottom-0 flex flex-col"
        style={{ top: 58, width: 220, background: '#ffffff', borderRight: '1px solid #e8e8e8', zIndex: 40 }}
      >
        <nav className="flex-1 py-3">
          {ACCOUNT_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] no-underline transition-colors duration-100 hover:bg-[#f7f7f7]"
              style={{ color: '#4d4d4d' }}
            >
              <Icon size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              {label}
            </a>
          ))}
          <div style={{ height: 1, background: '#e8e8e8', margin: '8px 16px' }} />
          <LogoutButton
            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors duration-100 hover:bg-[#fdf0f4]"
            style={{ color: '#4d4d4d', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          />
        </nav>
      </aside>
    )
  }

  if (!basePath) return null

  return (
    <aside
      className="fixed left-0 bottom-0 flex flex-col transition-all duration-200"
      style={{
        top: 58,
        width: collapsed ? 0 : 220,
        background: '#ffffff',
        borderRight: collapsed ? 'none' : '1px solid #e8e8e8',
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      <nav className="flex-1 py-3 overflow-y-auto" style={{ minWidth: 220 }}>
        {items.map(item => {
          if (item.type === 'all') {
            const isActive = !activeCategory && !activeSubcategory
            return (
              <button
                key="all"
                onClick={() => navigate()}
                className="flex w-full items-center justify-between px-4 py-2 text-[13px] transition-colors duration-100"
                style={{
                  color: '#4d4d4d',
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? '#fdf3d0' : 'transparent',
                  borderLeft: isActive ? '3px solid #ffc107' : '3px solid transparent',
                }}
              >
                <span>{item.label}</span>
                <span className="text-[11px]" style={{ color: '#9ca3af' }}>{item.count}</span>
              </button>
            )
          }

          const isCatActive = activeCategory === item.label && !activeSubcategory
          const groupOpen = openGroups[item.label] ?? (activeCategory === item.label)

          return (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (item.children.length > 0) toggleGroup(item.label)
                  navigate(item.label)
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-[13px] transition-colors duration-100"
                style={{
                  color: '#4d4d4d',
                  fontWeight: isCatActive ? 600 : 400,
                  background: isCatActive ? '#fdf3d0' : 'transparent',
                  borderLeft: isCatActive ? '3px solid #ffc107' : '3px solid transparent',
                }}
              >
                <span className="truncate text-left">{item.label}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-[11px]" style={{ color: '#9ca3af' }}>{item.count}</span>
                  {item.children.length > 0 && (
                    <ChevronDown
                      size={12}
                      style={{
                        color: '#9ca3af',
                        transform: groupOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 150ms',
                      }}
                    />
                  )}
                </div>
              </button>

              {groupOpen && item.children.map(child => {
                const isSubActive = activeCategory === item.label && activeSubcategory === child.label
                return (
                  <button
                    key={child.label}
                    onClick={() => navigate(item.label, child.label)}
                    className="flex w-full items-center justify-between py-1.5 text-[12px] transition-colors duration-100"
                    style={{
                      color: '#4d4d4d',
                      fontWeight: isSubActive ? 600 : 400,
                      background: isSubActive ? '#fdf3d0' : 'transparent',
                      borderLeft: isSubActive ? '3px solid #ffc107' : '3px solid transparent',
                      paddingLeft: 28,
                      paddingRight: 16,
                      opacity: isSubActive ? 1 : 0.7,
                    }}
                  >
                    <span className="truncate text-left">{child.label}</span>
                    <span className="text-[11px] flex-shrink-0" style={{ color: '#9ca3af' }}>{child.count}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(false)}
        className="sr-only"
        aria-label="Expand sidebar"
      />
    </aside>
  )
}

export function SidebarToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed flex items-center justify-center transition-colors duration-150 hover:bg-[#f7f7f7] z-40"
      style={{
        top: 58 + 12,
        left: collapsed ? 8 : 228,
        width: 24,
        height: 24,
        background: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: 6,
        color: '#9ca3af',
        transition: 'left 200ms',
      }}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
    </button>
  )
}
