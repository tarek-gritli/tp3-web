"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { User, Message } from "@/types/messaging"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageItem } from "@/components/message-item"
import { Send, AlertCircle } from "lucide-react"

interface MessagePanelProps {
  isConnected: boolean
  messages: Message[]
  currentUser: User | null
  onSendMessage: (text: string) => void
  onAddReaction: (messageId: string, reactionType: string) => void
  onAddComment: (messageId: string, text: string) => void
}

export function MessagePanel({
  isConnected,
  messages,
  currentUser,
  onSendMessage,
  onAddReaction,
  onAddComment,
}: MessagePanelProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim() && isConnected) {
      onSendMessage(messageInput.trim())
      setMessageInput("")
    }
  }

  return (
<div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
  {/* Header */}
  <div className="border-b px-6 py-4 flex items-center justify-between bg-gray-50">
    <div>
      <h2 className="text-lg font-bold text-gray-800">Group Chat</h2>
    </div>
    {!isConnected && (
      <div className="flex items-center gap-2 text-amber-600 bg-amber-100 px-3 py-1 rounded-full text-xs font-medium">
        <AlertCircle className="h-4 w-4" />
        <span>Disconnected</span>
      </div>
    )}
  </div>

  {/* Reconnect Alert */}
  {!isConnected && (
    <div className="bg-amber-50 border-l-4 border-amber-400 px-4 py-3 m-4 rounded shadow-sm">
      <div className="flex items-start gap-3 text-amber-700">
        <AlertCircle className="h-5 w-5 mt-1" />
        <div>
          <p className="font-semibold">Connection lost</p>
          <p className="text-sm">Reconnecting to the chat server...</p>
        </div>
      </div>
    </div>
  )}

  {/* Messages */}
  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white">
    {messages.map((message) => (
      <MessageItem
        key={message.id}
        message={message}
        currentUser={currentUser}
        onAddReaction={onAddReaction}
        onAddComment={onAddComment}
      />
    ))}
    <div ref={messagesEndRef} />
  </div>

  {/* Message Input */}
  <div className="border-t bg-gray-50 px-6 py-4">
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <Input
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message..."
        disabled={!isConnected}
        className="flex-1 rounded-md border-gray-300 focus:ring-primary focus:border-primary"
      />
      <Button
        type="submit"
        disabled={!isConnected || !messageInput.trim()}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">Send</span>
      </Button>
    </form>
  </div>
</div>

  )
}