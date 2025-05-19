"use client"

import { useState } from "react"
import type { User, Channel } from "@/types/messaging"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Settings, Plus } from "lucide-react"

interface ChatSidebarProps {
  currentUser: User | null
  channels: Channel[]
  users: User[]
  activeChannel: Channel | null
  onChannelSelect: (channel: Channel) => void
}

export function ChatSidebar({ currentUser, channels, users, activeChannel, onChannelSelect }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState("channels")

  return (
    <div className="w-64 h-full border-r bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md flex flex-col">
  {currentUser && (
    <div className="p-4 border-b border-border flex items-center gap-3">
      <Avatar className="h-10 w-10 ring-1 ring-primary/20">
        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
        <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-foreground">{currentUser.name}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <span
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              currentUser.status === "online" ? "bg-green-500" : "bg-gray-400"
            )}
          />
          {currentUser.status === "online" ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  )}

  <Tabs defaultValue="channels" className="flex-1 flex flex-col">
    <TabsList className="grid grid-cols-3 mx-3 mt-3 bg-muted/40 rounded-lg p-1 shadow-inner">
      <TabsTrigger value="channels" onClick={() => setActiveTab("channels")} className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
        <MessageSquare className="h-4 w-4" />
      </TabsTrigger>
      <TabsTrigger value="users" onClick={() => setActiveTab("users")} className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
        <Users className="h-4 w-4" />
      </TabsTrigger>
      <TabsTrigger value="settings" onClick={() => setActiveTab("settings")} className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
        <Settings className="h-4 w-4" />
      </TabsTrigger>
    </TabsList>

    {/* Channels */}
    <TabsContent value="channels" className="flex-1 overflow-y-auto p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Channels</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted/40">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {channels.map((channel) => (
          <button
            key={channel.id}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors",
              activeChannel?.id === channel.id
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/50"
            )}
            onClick={() => onChannelSelect(channel)}
          >
            <span># {channel.name}</span>
            {channel.unreadCount > 0 && (
              <span className="bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                {channel.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </TabsContent>

    {/* Users */}
    <TabsContent value="users" className="flex-1 overflow-y-auto p-3">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Users</h3>
      <div className="space-y-1">
        {users.map((user) => (
          <div
            key={user.id}
            className="px-3 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-muted/40 transition-colors"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{user.name}</span>
            <span
              className={cn(
                "w-2 h-2 rounded-full ml-auto",
                user.status === "online" ? "bg-green-500" : "bg-gray-400"
              )}
            />
          </div>
        ))}
      </div>
    </TabsContent>

    {/* Settings */}
    <TabsContent value="settings" className="flex-1 p-4">
      <h3 className="font-semibold text-muted-foreground uppercase text-sm mb-4">Settings</h3>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Theme</label>
          <select className="w-full p-2 rounded-md border border-border bg-background">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Notifications</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="notifications" className="rounded accent-primary" />
            <label htmlFor="notifications" className="text-sm">
              Enable notifications
            </label>
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</div>

  )
}
