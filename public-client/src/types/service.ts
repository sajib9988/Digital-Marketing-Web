// Mirrors backend's public Service shape (GET /services/public) — only the
// fields the public site actually needs to display.
export type Service = {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  description: string
  icon: string | null
  image: string | null
  isActive: boolean
  sortOrder: number
}
