"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import type { Message, Reaction, Comment } from "@/types/messaging"

interface MessagingSocketOptions {
  onAllMessages?: (messages: Message[]) => void
  onNewMessage?: (message: Message) => void
  onReaction?: (messageId: string, reaction: Reaction) => void
  onComment?: (messageId: string, comment: Comment) => void
}

export function useMessagingSocket(options: MessagingSocketOptions = {}) {
  const { onAllMessages, onNewMessage, onReaction, onComment } = options
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Prevent multiple socket instances
    if (socketRef.current) {
      return
    }

    // Connect to the NestJS WebSocket server with improved configuration
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      // Add withCredentials if you're using cookies for authentication
      // withCredentials: true,
    })

    socket.on("connect", () => {
      setIsConnected(true)
      console.log("Socket connected with ID:", socket.id)
    })

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
      // Don't disconnect on error, let the reconnection logic handle it
    })

    socket.on("disconnect", (reason) => {
      setIsConnected(false)
      console.log("Socket disconnected. Reason:", reason)

      // If the server disconnected us, don't try to reconnect automatically
      if (reason === "io server disconnect") {
        // Manual reconnection
        setTimeout(() => {
          socket.connect()
        }, 1000)
      }
      // For all other disconnection reasons, socket.io will try to reconnect automatically
    })

    socket.on("message", (payload) => {
      console.log("Received message event:", payload)
      const { event, data } = payload

      switch (event) {
        case "allMessages":
          onAllMessages?.(data)
          break
        case "message":
          onNewMessage?.(data)
          break
        case "reaction":
          onReaction?.(data.messageId, data.reaction)
          break
        case "comment":
          onComment?.(data.messageId, data.comment)
          break
        default:
          console.log("Unknown event:", event, data)
      }
    })

    socketRef.current = socket

    // Clean up function
    return () => {
      console.log("Cleaning up socket connection")
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const sendMessage = useCallback(
    (messageData: { userId: string; username: string; text: string }) => {
      if (!isConnected || !socketRef.current) {
        console.warn("Cannot send message: Socket not connected")
        return
      }

      console.log("Sending message:", messageData)
      socketRef.current.emit("message", {
        event: "message",
        data: messageData,
      })
    },
    [isConnected],
  )

  const addReaction = useCallback(
    (reactionData: { messageId: string; userId: string; reactionType: string }) => {
      if (!isConnected || !socketRef.current) {
        console.warn("Cannot add reaction: Socket not connected")
        return
      }

      console.log("Adding reaction:", reactionData)
      socketRef.current.emit("reaction", {
        event: "reaction",
        data: reactionData,
      })
    },
    [isConnected],
  )

  const addComment = useCallback(
    (commentData: { messageId: string; userId: string; username: string; text: string }) => {
      if (!isConnected || !socketRef.current) {
        console.warn("Cannot add comment: Socket not connected")
        return
      }

      console.log("Adding comment:", commentData)
      socketRef.current.emit("comment", {
        event: "comment",
        data: commentData,
      })
    },
    [isConnected],
  )

  return {
    isConnected,
    sendMessage,
    addReaction,
    addComment,
  }
}
