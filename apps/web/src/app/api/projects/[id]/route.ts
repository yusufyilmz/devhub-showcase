import { z } from 'zod'
import { ProjectService } from '@/services/project'
import { errorHandling, NotFoundError, ValidationError } from '@shared/utils'
import { siteCopy } from '@shared/content'
import { updateProjectSchema } from '@/validation/schema/project'
import { NextRequest, NextResponse } from 'next/server'

const projectService = new ProjectService()

const idSchema = z.string().uuid()

const { errors } = siteCopy.notifications

export const GET = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const parsedId = idSchema.safeParse(id)

    if (!parsedId.success) {
      throw new ValidationError(errors.invalidId)
    }

    const project = await projectService.getProjectById(parsedId.data)
    if (!project) {
      throw new NotFoundError(errors.projectNotFound)
    }

    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    return errorHandling(error)
  }
}

const updateProjectById = async (req: NextRequest) => {
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
    if (!updatedProject) {
      throw new NotFoundError(errors.projectNotFound)
    }

    return NextResponse.json(
      { success: true, data: updatedProject },
      { status: 200 }
    )
  } catch (error) {
    return errorHandling(error)
  }
}

const deleteProjectById = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get('id')

    const parsedId = idSchema.safeParse(id)

    if (!parsedId.success) {
      throw new ValidationError(errors.invalidId)
    }

    const project = projectService.deleteProject(parsedId.data)
    return NextResponse.json(project, { status: 204 })
  } catch (error) {
    return errorHandling(error)
  }
}

export const PUT = updateProjectById
export const DELETE = deleteProjectById
