export interface UserProfile {
  name: string
  user_name?: string
  avatar?: string
  bio?: string
  education?: string
  category?: string
  postCount?: number
  posts?: Post[]
}

export interface Post {
  id: string
  authorId: string
  company: string
  meta: string
  badge?: string
  title: string
  desc: string
  descHtml?: string
  imageUrl?: string
  authorAvatar?: string
  tags: string[]
  logoBg: string
  logoText: string
  likeCount: number
  commentCount: number
  shareCount: number
  bookmarkCount: number
  likedByMe: boolean
  bookmarkedByMe: boolean
}

export interface PostComment {
  id: string | number
  author?: {
    id: string
    user_name?: string
    phone?: string
  }
  content: string
  createdAt: string
}
