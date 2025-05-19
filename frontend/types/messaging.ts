export interface User {
  id: string
  username: string
  avatar?: string
  status?: "online" | "offline"
}

export interface Reaction {
  type: string
  count: number
  users: string[]
}

export interface Comment {
  id: string
  userId: string
  username: string
  text: string
  timestamp: string | Date
}

export interface Message {
  id: string
  userId: string
  username: string
  text: string
  timestamp: string | Date
  reactions: Record<string, Reaction>
  comments: Comment[]
}

export interface Channel {
  id: string
  name: string
  unreadCount: number
}
