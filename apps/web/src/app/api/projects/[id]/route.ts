import { z } from 'zod'
import { errorHandling, ValidationError } from '@shared/lib'
import { copy } from '@shared/content'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateProjectSchema } from '@/validation/schema/project'
import { ProjectService } from '@/services/project'

const projectService = new ProjectService()

const idSchema = z.string().uuid()

const { errors } = copy.notifications

const getProjectById = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const parsedId = idSchema.safeParse(id)

    if (!parsedId.success) {
      throw new ValidationError(errors.invalidId)
    }

    const project = await projectService.getProjectById(parsedId.data)

    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    return errorHandling(error)
  }
}

const updateProjectById = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const parsedId = idSchema.safeParse(id)

    if (!parsedId.success) {
      throw new ValidationError(errors.invalidId)
    }

    const parsedResult = updateProjectSchema.safeParse(req.body)
    if (!parsedResult.success) {
      throw new ValidationError(errors.validationError)
    }

    const updatedProject = await projectService.updateProject(
      parsedId.data,
      parsedResult.data
    )

    return NextResponse.json(
      { success: true, data: updatedProject },
      { status: 200 }
    )
  } catch (error) {
    return errorHandling(error)
  }
}

const deleteProjectById = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const id = req.nextUrl.searchParams.get('id')

    const parsedId = idSchema.safeParse(id)

    if (!parsedId.success) {
      throw new ValidationError(errors.invalidId)
    }

    const project = await projectService.deleteProject(parsedId.data)
    return NextResponse.json(project, { status: 204 })
  } catch (error) {
    return errorHandling(error)
  }
}

export const GET = getProjectById
export const PUT = updateProjectById
export const DELETE = deleteProjectById
