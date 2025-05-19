"use client"

import type React from "react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { User, Message, Comment } from "@/types/messaging"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Smile, MessageSquare, MoreHorizontal, Send } from "lucide-react"

interface MessageItemProps {
  message: Message
  currentUser: User | null
  onAddReaction: (messageId: string, reactionType: string) => void
  onAddComment: (messageId: string, text: string) => void
}

export function MessageItem({ message, currentUser, onAddReaction, onAddComment }: MessageItemProps) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentInput, setCommentInput] = useState("")

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentInput.trim()) {
      onAddComment(message.id, commentInput)
      setCommentInput("")
      setShowCommentInput(false)
    }
  }

  const formatTimestamp = (timestamp: string | Date) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  const isCurrentUserMessage = message.userId === currentUser?.id

  return (
    <div className={cn("group", isCurrentUserMessage ? "ml-auto max-w-[75%]" : "max-w-[75%]")}>
  <div className="flex gap-3 items-start">
    {!isCurrentUserMessage && (
      <Avatar className="h-9 w-9 ring-1 ring-gray-200 shadow-sm">
        <AvatarImage
          src={`/placeholder.svg?height=40&width=40&text=${message.username.substring(0, 2)}`}
          alt={message.username}
        />
        <AvatarFallback>{message.username.substring(0, 2)}</AvatarFallback>
      </Avatar>
    )}

    <div className={cn("flex flex-col gap-1", isCurrentUserMessage && "items-end")}>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {!isCurrentUserMessage && <span className="font-medium text-gray-700">{message.username}</span>}
        <span>{formatTimestamp(message.timestamp)}</span>
      </div>

      <div
        className={cn(
          "px-4 py-2 rounded-xl text-sm shadow-sm break-words whitespace-pre-wrap",
          isCurrentUserMessage
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        )}
      >
        <p>{message.text}</p>
      </div>

      {/* Reactions */}
      {message.reactions && Object.keys(message.reactions).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 text-xs">
          {Object.values(message.reactions).map((reaction) => (
            <div
              key={reaction.type}
              className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer"
              title={`${reaction.count} reaction${reaction.count !== 1 ? "s" : ""}`}
            >
              <span>{reaction.type}</span>
              <span>{reaction.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div
        className={cn(
          "flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isCurrentUserMessage ? "justify-end" : "justify-start"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Smile className="h-4 w-4" />
              <span className="sr-only">Add reaction</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="grid grid-cols-6 gap-1 p-2">
              {["👍", "❤️", "😂", "😮", "😢", "😡"].map((emoji) => (
                <DropdownMenuItem
                  key={emoji}
                  className="cursor-pointer p-2 flex justify-center"
                  onClick={() => onAddReaction(message.id, emoji)}
                >
                  {emoji}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Comment</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isCurrentUserMessage ? "end" : "start"}>
            <DropdownMenuItem>Copy text</DropdownMenuItem>
            {isCurrentUserMessage && (
              <DropdownMenuItem className="text-red-500">Delete message</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <form onSubmit={handleAddComment} className="mt-2 flex gap-2 items-center">
          <Input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            className="h-8 text-sm rounded-md"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={!commentInput.trim()}
            className="px-2 py-1 h-8"
          >
            <Send className="h-3 w-3" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      )}

      {/* Comments */}
      {message.comments && message.comments.length > 0 && (
        <div className="mt-2 space-y-2">
          {message.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} isCurrentUser={comment.userId === currentUser?.id} />
          ))}
        </div>
      )}
    </div>
  </div>
</div>
  )
}

interface CommentItemProps {
  comment: Comment
  isCurrentUser: boolean
}

function CommentItem({ comment, isCurrentUser }: CommentItemProps) {
  const formatTimestamp = (timestamp: string | Date) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  return (
    <div className={cn("flex gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
      {!isCurrentUser && (
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={`/placeholder.svg?height=40&width=40&text=${comment.username.substring(0, 2)}`}
            alt={comment.username}
          />
          <AvatarFallback>{comment.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[80%]", isCurrentUser ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 mb-0.5">
          {!isCurrentUser && <span className="font-medium text-xs">{comment.username}</span>}
          <span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
        </div>

        <div
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm",
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          <p>{comment.text}</p>
        </div>
      </div>
    </div>
  )
}
