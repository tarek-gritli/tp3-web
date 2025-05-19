"use client"

import { useState, useEffect, useCallback } from "react"
import { useMessagingSocket } from "@/hooks/use-messaging-socket"
import { MessagePanel } from "@/components/message-panel"
import type { User, Message, Reaction, Comment } from "@/types/messaging"

export function MessagingApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Then update the handler functions to use useCallback
  const handleAllMessages = useCallback(
    (allMessages: Message[]) => {
      setMessages(allMessages)
    },
    [setMessages],
  )

  const handleNewMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message])
    },
    [setMessages],
  )

  const handleReaction = useCallback(
    (messageId: string, reaction: Reaction) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [reaction.type]: reaction,
                },
              }
            : msg,
        ),
      )
    },
    [setMessages],
  )

  const handleComment = useCallback(
    (messageId: string, comment: Comment) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                comments: [...msg.comments, comment],
              }
            : msg,
        ),
      )
    },
    [setMessages],
  )

  const { isConnected, sendMessage, addReaction, addComment } = useMessagingSocket({
    onAllMessages: handleAllMessages,
    onNewMessage: handleNewMessage,
    onReaction: handleReaction,
    onComment: handleComment,
  })

  useEffect(() => {
    // Set a mock current user
    // In a real app, you would get this from authentication
    const mockUser: User = {
      id: `user-${Math.floor(Math.random() * 10000)}`,
      username: `User${Math.floor(Math.random() * 1000)}`,
      avatar: `/placeholder.svg?height=40&width=40`,
    }

    setCurrentUser(mockUser)
  }, [])

  const handleSendMessage = (text: string) => {
    if (!currentUser) return

    sendMessage({
      userId: currentUser.id,
      username: currentUser.username,
      text,
    })
  }

  const handleAddReaction = (messageId: string, reactionType: string) => {
    if (!currentUser) return

    addReaction({
      messageId,
      userId: currentUser.id,
      reactionType,
    })
  }

  const handleAddComment = (messageId: string, text: string) => {
    if (!currentUser) return

    addComment({
      messageId,
      userId: currentUser.id,
      username: currentUser.username,
      text,
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MessagePanel
        isConnected={isConnected}
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onAddReaction={handleAddReaction}
        onAddComment={handleAddComment}
      />
    </div>
  )
}
