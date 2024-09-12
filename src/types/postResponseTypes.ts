import type { Post } from "./postTypes"

export type PaginationLinks = {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}
export type MetaData = {
  current_page: number
  from: number | null
  last_page: number
  links: MetaLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export type MetaLink = {
  url: string | null
  label: string
  active: boolean
}


export type PostListResponse = {
  data: Post[]
  links: PaginationLinks
  meta: MetaData
}
