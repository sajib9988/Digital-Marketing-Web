import { getSiteSeo, getMediaOptions } from '@/services/payload.service'
import { SeoForm } from '@/components/admin/seo/seo-form'
import { ApiErrorState } from '@/components/admin/api-error-state'

export default async function SeoPage() {
  let seo, mediaOptions
  try {
    ;[seo, mediaOptions] = await Promise.all([getSiteSeo(), getMediaOptions()])
  } catch (error) {
    return (
      <ApiErrorState
        message={error instanceof Error ? error.message : 'Unknown error'}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">SEO</h1>
        <p className="text-muted-foreground">Sitewide default SEO settings.</p>
      </div>
      <SeoForm seo={seo} mediaOptions={mediaOptions} />
    </div>
  )
}
