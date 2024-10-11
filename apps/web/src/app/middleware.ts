import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import logger from '@/logger'

export function middleware(req: Request) {
  const correlationId = req.headers.get('x-correlation-id') || uuidv4()

  try {
    logger.info({
      message: `Request received`,
      method: req.method,
      url: req.url,
      correlationId
    })

    const response = NextResponse.next()

    response.headers.set('x-correlation-id', correlationId)

    return response
  } catch (error) {
    logger.error({
      message: `Error in middleware: ${(error as Error).message}`,
      correlationId,
      error
    })

    return NextResponse.json(
      { error: 'An error occurred in middleware.', correlationId },
      { status: 500 }
    )
  }
}

export const config = {
  matcher: ['/api/:path*']
}
