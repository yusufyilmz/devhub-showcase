import { Skeleton } from '@mui/material'

export const ProjectItemSkeleton: React.FC = () => {
  return (
    <div className="border p-6 rounded-lg shadow-lg bg-backgroundColor-card h-[700px] max-w-3xl w-[30vw]">
      <Skeleton variant="text" width="100%" height={40} />

      <Skeleton variant="text" width="100%" height={20} className="my-4" />
      <Skeleton variant="text" width="80%" height={20} className="mb-4" />

      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        className="rounded-md shadow-md"
      />

      <div className="flex gap-4 mt-4">
        <Skeleton variant="rectangular" width="100%" height={50} />
        <Skeleton variant="rectangular" width="100%" height={50} />
      </div>
    </div>
  )
}
