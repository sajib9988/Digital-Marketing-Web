import { getPosts, getMediaOptions } from '@/services/payload.service'
import { PostList } from '@/components/admin/posts/post-list'
import { ApiErrorState } from '@/components/admin/api-error-state'

export default async function BlogAdminPage() {
  let posts, mediaOptions
  try {
    ;[posts, mediaOptions] = await Promise.all([getPosts(), getMediaOptions()])
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
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="text-muted-foreground">Manage blog posts in Payload CMS.</p>
      </div>
      <PostList data={posts} mediaOptions={mediaOptions} />
    </div>
  )
}
