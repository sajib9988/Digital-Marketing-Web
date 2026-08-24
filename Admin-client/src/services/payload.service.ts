'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Navigation, Page, Post, SiteSeo } from '@payload-types'

// All Payload CMS operations for the dashboard's CMS Data zone live in this
// one file — Local API only, no HTTP/fetch, since Payload runs in-process in
// this same Next.js app.

// ---- Pages ----

export async function getPages(): Promise<Page[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    sort: '-updatedAt',
    limit: 200,
    depth: 0,
  })
  return result.docs
}

export async function getPageById(id: string): Promise<Page> {
  const payload = await getPayload({ config })
  return payload.findByID({ collection: 'pages', id, depth: 0 })
}

export async function createPage(data: Omit<Page, 'id' | 'updatedAt' | 'createdAt'>) {
  const payload = await getPayload({ config })
  return payload.create({ collection: 'pages', data })
}

export async function updatePage(
  id: string,
  data: Partial<Omit<Page, 'id' | 'updatedAt' | 'createdAt'>>,
) {
  const payload = await getPayload({ config })
  return payload.update({ collection: 'pages', id, data })
}

export async function deletePage(id: string) {
  const payload = await getPayload({ config })
  return payload.delete({ collection: 'pages', id })
}

// ---- Blog (Posts) ----

export async function getPosts(): Promise<Post[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    sort: '-updatedAt',
    limit: 200,
    depth: 0,
  })
  return result.docs
}

export async function getPostById(id: string): Promise<Post> {
  const payload = await getPayload({ config })
  return payload.findByID({ collection: 'posts', id, depth: 0 })
}

export async function createPost(data: Omit<Post, 'id' | 'updatedAt' | 'createdAt'>) {
  const payload = await getPayload({ config })
  return payload.create({ collection: 'posts', data })
}

export async function updatePost(
  id: string,
  data: Partial<Omit<Post, 'id' | 'updatedAt' | 'createdAt'>>,
) {
  const payload = await getPayload({ config })
  return payload.update({ collection: 'posts', id, data })
}

export async function deletePost(id: string) {
  const payload = await getPayload({ config })
  return payload.delete({ collection: 'posts', id })
}

// ---- Navigation (global) ----

export async function getNavigation(): Promise<Navigation> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'navigation' })
}

export async function updateNavigation(data: Partial<Navigation>) {
  const payload = await getPayload({ config })
  return payload.updateGlobal({ slug: 'navigation', data })
}

// ---- Site SEO (global) ----

export async function getSiteSeo(): Promise<SiteSeo> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-seo' })
}

export async function updateSiteSeo(data: Partial<SiteSeo>) {
  const payload = await getPayload({ config })
  return payload.updateGlobal({ slug: 'site-seo', data })
}

// ---- Media (for image-picker selects in Pages/Posts forms) ----

export type MediaOption = { id: string; label: string }

export async function getMediaOptions(): Promise<MediaOption[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    limit: 200,
    sort: '-updatedAt',
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    label: doc.alt || doc.filename || String(doc.id),
  }))
}

// ---- CMS zone overview (/admin/content) ----

export async function getCmsOverviewStats() {
  const payload = await getPayload({ config })
  const [pages, posts] = await Promise.all([
    payload.count({ collection: 'pages' }),
    payload.count({ collection: 'posts' }),
  ])
  return { pageCount: pages.totalDocs, postCount: posts.totalDocs }
}
