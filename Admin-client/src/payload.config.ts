import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  editor: lexicalEditor(),

  collections: [],

  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/payload',
    },
  }),

  sharp,
})
