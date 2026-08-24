import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/components/admin/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Sign in to manage business data and CMS content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <p className="pb-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{' '}
          <Link href="/admin/register" className="underline underline-offset-4">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  )
}
