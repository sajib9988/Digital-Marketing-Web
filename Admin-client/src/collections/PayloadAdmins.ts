import type { CollectionConfig } from 'payload'

// Payload's admin panel (payload_db) requires its own auth-enabled collection to
// log in with. This is separate from the NestJS admin auth in app_db (see CLAUDE.md
// section 12/13) — Payload's built-in panel is not the primary admin interface,
// but it still needs credentials of its own to exist at all.
export const PayloadAdmins: CollectionConfig = {
  slug: 'payload-admins',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
