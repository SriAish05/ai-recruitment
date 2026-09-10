import { Briefcase, FileText, LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/screen', label: 'Screen', icon: FileText },
  { to: '/interview', label: 'Interview', icon: Users },
]
