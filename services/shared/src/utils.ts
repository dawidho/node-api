export function errorResponse(code: string, message: string) {
  return {
    error: {
      code,
      message,
    },
  }
}

export function successResponse<T>(data: T) {
  return {
    success: true,
    data,
  }
}

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function formatDate(date: Date): string {
  return date.toISOString()
}

