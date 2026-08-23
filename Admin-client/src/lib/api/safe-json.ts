export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type NestErrorBody = {
  message?: string | string[]
  error?: string
}

// Centralized response handling for all services/api/* calls — throws a typed
// ApiError with NestJS's error message on non-2xx, otherwise parses JSON.
export async function safeJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as NestErrorBody
      message = Array.isArray(body.message)
        ? body.message.join(', ')
        : (body.message ?? body.error ?? message)
    } catch {
      // Response body wasn't JSON — fall back to statusText.
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
