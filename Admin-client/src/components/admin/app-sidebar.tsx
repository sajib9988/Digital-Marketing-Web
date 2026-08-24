'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  Contact,
  FileText,
  FolderKanban,
  Globe,
  LayoutDashboard,
  MessagesSquare,
  Navigation as NavigationIcon,
  Newspaper,
  Search,
  UserCog,
  Users,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { UserMenu } from '@/components/admin/user-menu'
import type { SessionUser } from '@/lib/api/session'

const businessDataItems = [
  { title: 'Services', url: '/admin/services', icon: Briefcase },
  { title: 'Projects', url: '/admin/projects', icon: FolderKanban },
  { title: 'Clients', url: '/admin/clients', icon: Users },
  { title: 'Testimonials', url: '/admin/testimonials', icon: MessagesSquare },
  { title: 'Contacts', url: '/admin/contacts', icon: Contact },
  // Managing admin accounts (and promoting USER -> ADMIN) is SUPER_ADMIN-only.
  { title: 'Users', url: '/admin/users', icon: UserCog, superAdminOnly: true },
]

const cmsDataItems = [
  { title: 'Content', url: '/admin/content', icon: FileText },
  { title: 'Pages', url: '/admin/pages', icon: Globe },
  { title: 'Blog', url: '/admin/blog', icon: Newspaper },
  { title: 'Navigation', url: '/admin/navigation', icon: NavigationIcon },
  { title: 'SEO', url: '/admin/seo', icon: Search },
]

export function AppSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname()
  const visibleBusinessDataItems = businessDataItems.filter(
    (item) => !item.superAdminOnly || user.role === 'SUPER_ADMIN',
  )

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin/dashboard" />}>
              <LayoutDashboard />
              <span className="font-semibold">Admin Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleBusinessDataItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname.startsWith(item.url)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>CMS Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {cmsDataItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname.startsWith(item.url)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
