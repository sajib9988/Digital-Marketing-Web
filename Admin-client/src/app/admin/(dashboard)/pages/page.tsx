import { getPages, getMediaOptions } from '@/services/payload.service'
import { PageList } from '@/components/admin/pages/page-list'
import { ApiErrorState } from '@/components/admin/api-error-state'

export default async function PagesAdminPage() {
  let pages, mediaOptions
  try {
    ;[pages, mediaOptions] = await Promise.all([getPages(), getMediaOptions()])
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
        <h1 className="text-2xl font-semibold">Pages</h1>
        <p className="text-muted-foreground">Manage site pages in Payload CMS.</p>
      </div>
      <PageList data={pages} mediaOptions={mediaOptions} />
    </div>
  )
}
