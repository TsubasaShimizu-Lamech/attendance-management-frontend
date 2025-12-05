"use client"
import { useState } from "react"
import { AttendanceTable } from "@/components/attendance-table"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function AttendancePage() {
  const [isAdmin] = useState(true)
  const [currentUserId, setCurrentUserId] = useState("me")
  const [currentUserName, setCurrentUserName] = useState("あなた")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleUserSelect = (userId: string, userName: string) => {
    setCurrentUserId(userId)
    setCurrentUserName(userName)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        onUserSelect={handleUserSelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="overflow-x-hidden">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)} className="shrink-0">
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{currentUserName}さんの勤怠管理</h1>
                <p className="text-sm text-muted-foreground">月次の勤怠情報を入力してください</p>
              </div>
            </div>
          </header>

          <Tabs defaultValue="actual" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="actual">勤怠実績</TabsTrigger>
              <TabsTrigger value="planned">勤怠予定</TabsTrigger>
            </TabsList>

            <TabsContent value="actual">
              <AttendanceTable mode="actual" userId={currentUserId} />
            </TabsContent>

            <TabsContent value="planned">
              <AttendanceTable mode="planned" userId={currentUserId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
