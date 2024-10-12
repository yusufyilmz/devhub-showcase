export type ServerResponse<T> = {
  success: boolean
  data: T
  error: Error
}
