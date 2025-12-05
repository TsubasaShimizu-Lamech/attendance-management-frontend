"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  isAdmin: boolean
  currentUserId: string
  onUserSelect: (userId: string, userName: string) => void
  isOpen: boolean
  onClose: () => void
}

interface TeamMember {
  id: string
  name: string
}

const teamMembers: TeamMember[] = [
  { id: "yamada", name: "山田太郎" },
  { id: "tanaka", name: "田中花子" },
  { id: "oguri", name: "小栗旬" },
]

export function AdminSidebar({ isAdmin, currentUserId, onUserSelect, isOpen, onClose }: AdminSidebarProps) {
  if (!isAdmin) return null

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full w-64 border-r border-border bg-card shadow-lg flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              メニュー
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <Button
                variant={currentUserId === "me" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  currentUserId === "me" && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                )}
                onClick={() => {
                  onUserSelect("me", "あなた")
                  onClose()
                }}
              >
                <User className="h-4 w-4" />
                勤怠入力（自分の勤怠）
              </Button>

              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">管理者</p>
              </div>

              {teamMembers.map((member) => (
                <Button
                  key={member.id}
                  variant={currentUserId === member.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start pl-8",
                    currentUserId === member.id && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                  )}
                  onClick={() => {
                    onUserSelect(member.id, member.name)
                    onClose()
                  }}
                >
                  {member.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  )
}
