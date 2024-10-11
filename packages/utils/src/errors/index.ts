import { HttpStatusCode } from 'axios'
import { NextResponse } from 'next/server'

class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Validation Error') {
    super(message, 400)
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Resource Not Found') {
    super(message, 404)
  }
}

class BadRequestError extends CustomError {
  constructor(message = 'Bad Request') {
    super(message, 400)
  }
}

const errorHandling = (error: unknown) => {
  let statusCode = 500
  let errorMessage = 'Internal Server Error'

  if (error instanceof CustomError) {
    statusCode = error.statusCode
    errorMessage = error.message
  }

  return NextResponse.json(
    { message: `An error occurred: ${errorMessage}` },
    { status: statusCode }
  )
}

export {
  CustomError,
  ValidationError,
  NotFoundError,
  BadRequestError,
  errorHandling
}
