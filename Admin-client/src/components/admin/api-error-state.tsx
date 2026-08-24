import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Shown when a Business Data page's initial NestJS fetch fails — most
// commonly because the backend isn't running yet. Keeps the dashboard usable
// in isolation instead of crashing to Next.js's default error boundary.
export function ApiErrorState({ message }: { message: string }) {
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-destructive" />
          <CardTitle>Couldn’t reach the API</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Make sure the NestJS backend is running and `API_URL` is set correctly
        in Admin-client’s .env.
      </CardContent>
    </Card>
  )
}
