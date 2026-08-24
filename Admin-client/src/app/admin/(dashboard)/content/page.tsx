import Link from 'next/link'
import { Globe, Navigation, Newspaper, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCmsOverviewStats } from '@/services/payload.service'

const quickLinks = [
  { title: 'Pages', href: '/admin/pages', icon: Globe },
  { title: 'Blog', href: '/admin/blog', icon: Newspaper },
  { title: 'Navigation', href: '/admin/navigation', icon: Navigation },
  { title: 'SEO', href: '/admin/seo', icon: Search },
]

export default async function ContentOverviewPage() {
  const stats = await getCmsOverviewStats().catch(() => null)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Content</h1>
        <p className="text-muted-foreground">CMS content overview.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Pages</CardDescription>
            <CardTitle className="text-3xl">{stats?.pageCount ?? '—'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Blog posts</CardDescription>
            <CardTitle className="text-3xl">{stats?.postCount ?? '—'}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <link.icon className="size-5 text-muted-foreground" />
                <CardTitle className="text-base">{link.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
