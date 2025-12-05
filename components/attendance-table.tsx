"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AttendanceRecord {
  id: string
  date: string
  projectName: string
  startTime: string
  endTime: string
  breakTime: string
  workContent: string
}

interface PlannedData {
  [key: string]: Partial<AttendanceRecord>
}

const projects = ["プロジェクトA", "プロジェクトB", "プロジェクトC", "運用保守", "社内業務"]

// サンプルの予定データ
const samplePlannedData: PlannedData = {
  "0": {
    projectName: "プロジェクトA",
    startTime: "09:00",
    endTime: "18:00",
    breakTime: "1:00",
    workContent: "要件定義",
  },
  "1": {
    projectName: "プロジェクトA",
    startTime: "09:00",
    endTime: "18:00",
    breakTime: "1:00",
    workContent: "設計作業",
  },
}

export function AttendanceTable({ mode, userId }: { mode: "actual" | "planned"; userId: string }) {
  const { toast } = useToast()
  const [records, setRecords] = useState<AttendanceRecord[]>([
    {
      id: "0",
      date: new Date().toISOString().split("T")[0],
      projectName: "",
      startTime: "",
      endTime: "",
      breakTime: "",
      workContent: "",
    },
  ])

  const addRow = () => {
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      projectName: "",
      startTime: "",
      endTime: "",
      breakTime: "",
      workContent: "",
    }
    setRecords([...records, newRecord])
  }

  const deleteRow = (id: string) => {
    if (records.length === 1) {
      toast({
        title: "エラー",
        description: "最低1行は必要です",
        variant: "destructive",
      })
      return
    }
    setRecords(records.filter((record) => record.id !== id))
  }

  const updateRecord = (id: string, field: keyof AttendanceRecord, value: string) => {
    setRecords(records.map((record) => (record.id === id ? { ...record, [field]: value } : record)))
  }

  const handleSave = () => {
    toast({
      title: mode === "actual" ? "実績を保存しました" : "予定を保存しました",
      description: `${records.length}件のレコードを保存しました`,
    })
  }

  const getPlaceholder = (recordId: string, field: keyof AttendanceRecord) => {
    if (mode === "actual" && samplePlannedData[recordId]) {
      return (samplePlannedData[recordId][field] as string) || ""
    }
    return ""
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button onClick={addRow} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          行を追加
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                      日付
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                      案件名
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                      開始時間
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                      終了時間
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                      休憩時間
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      作業内容
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                      削除
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Input
                          type="date"
                          value={record.date}
                          onChange={(e) => updateRecord(record.id, "date", e.target.value)}
                          className="w-40"
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Select
                          value={record.projectName}
                          onValueChange={(value) => updateRecord(record.id, "projectName", value)}
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue
                              placeholder={
                                mode === "actual" && getPlaceholder(record.id, "projectName")
                                  ? getPlaceholder(record.id, "projectName")
                                  : "選択してください"
                              }
                              className={
                                mode === "actual" && !record.projectName && getPlaceholder(record.id, "projectName")
                                  ? "text-muted-foreground/50"
                                  : ""
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project} value={project}>
                                {project}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Input
                          type="time"
                          value={record.startTime}
                          onChange={(e) => updateRecord(record.id, "startTime", e.target.value)}
                          placeholder={mode === "actual" ? getPlaceholder(record.id, "startTime") : ""}
                          className={`w-32 ${
                            mode === "actual" && !record.startTime && getPlaceholder(record.id, "startTime")
                              ? "placeholder:text-muted-foreground/40"
                              : ""
                          }`}
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Input
                          type="time"
                          value={record.endTime}
                          onChange={(e) => updateRecord(record.id, "endTime", e.target.value)}
                          placeholder={mode === "actual" ? getPlaceholder(record.id, "endTime") : ""}
                          className={`w-32 ${
                            mode === "actual" && !record.endTime && getPlaceholder(record.id, "endTime")
                              ? "placeholder:text-muted-foreground/40"
                              : ""
                          }`}
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Input
                          type="text"
                          value={record.breakTime}
                          onChange={(e) => updateRecord(record.id, "breakTime", e.target.value)}
                          placeholder={mode === "actual" ? getPlaceholder(record.id, "breakTime") : "例: 1:00"}
                          className={`w-24 ${
                            mode === "actual" && !record.breakTime && getPlaceholder(record.id, "breakTime")
                              ? "placeholder:text-muted-foreground/40"
                              : ""
                          }`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <Textarea
                          value={record.workContent}
                          onChange={(e) => updateRecord(record.id, "workContent", e.target.value)}
                          placeholder={mode === "actual" ? getPlaceholder(record.id, "workContent") : "作業内容を入力"}
                          className={`min-w-[200px] resize-none ${
                            mode === "actual" && !record.workContent && getPlaceholder(record.id, "workContent")
                              ? "placeholder:text-muted-foreground/40"
                              : ""
                          }`}
                          rows={2}
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Button
                          onClick={() => deleteRow(record.id)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="min-w-[120px]">
          <Save className="h-4 w-4 mr-2" />
          保存
        </Button>
      </div>
    </div>
  )
}
