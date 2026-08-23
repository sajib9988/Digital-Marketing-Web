import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Params = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Params) =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Params) => RootPage({ config, importMap, params, searchParams })

export default Page
