import { errorHandling, ValidationError } from '@shared/lib'
import { siteCopy } from '@shared/content'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ProjectService } from '@/services/project'
import { addProjectSchema } from '@/validation/schema/project'

const projectService = new ProjectService()

const { errors } = siteCopy.notifications

const createProject = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const parsedResult = addProjectSchema.safeParse(req.body)

    if (!parsedResult.success) {
      throw new ValidationError(errors.validationError)
    }

    const project = await projectService.createProject(parsedResult.data)
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    return errorHandling(error)
  }
}

const getAllProjects = async (_req: NextRequest): Promise<NextResponse> => {
  try {
    const project = await projectService.getAllProjects()
    return NextResponse.json({ success: true, data: project }, { status: 200 })
  } catch (error) {
    return errorHandling(error)
  }
}

export const POST = createProject
export const GET = getAllProjects