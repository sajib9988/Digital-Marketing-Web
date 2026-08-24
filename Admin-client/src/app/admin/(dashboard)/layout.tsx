import { redirect } from 'next/navigation'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/admin/app-sidebar'
import { getSessionUser } from '@/lib/api/session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()

  // Defense in depth — proxy.ts already gates /admin/*, this covers the edge
  // case of a token that decodes but is otherwise unusable, and blocks a
  // USER-role session from reaching the dashboard shell at all (verifyOtp
  // shouldn't set cookies for USER, but this is the backstop).
  if (!user || user.role === 'USER') {
    redirect('/admin/login')
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            Admin Dashboard
          </span>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
