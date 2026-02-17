"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Layers,
} from "lucide-react"

const moduleTemplates = [
  { id: "licensing", name: "Licensing Requirements" },
  { id: "capital", name: "Capital Adequacy" },
  { id: "governance", name: "Corporate Governance" },
  { id: "aml", name: "AML/CFT Compliance" },
  { id: "consumer", name: "Consumer Protection" },
  { id: "data", name: "Data Protection" },
  { id: "reporting", name: "Regulatory Reporting" },
  { id: "risk", name: "Risk Management" },
  { id: "cyber", name: "Cybersecurity" },
  { id: "audit", name: "Internal Audit" },
]

interface Module {
  id: string
  name: string
  description: string
  requirements: string[]
}

export default function NewFrameworkPage() {
  const router = useRouter()
  const [frameworkName, setFrameworkName] = useState("")
  const [frameworkDescription, setFrameworkDescription] = useState("")
  const [targetEntity, setTargetEntity] = useState("")
  const [modules, setModules] = useState<Module[]>([
    { id: "1", name: "", description: "", requirements: [""] },
  ])

  const addModule = () => {
    setModules([
      ...modules,
      { id: Date.now().toString(), name: "", description: "", requirements: [""] },
    ])
  }

  const removeModule = (id: string) => {
    if (modules.length > 1) {
      setModules(modules.filter((m) => m.id !== id))
    }
  }

  const updateModule = (id: string, field: keyof Module, value: string | string[]) => {
    setModules(modules.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const addRequirement = (moduleId: string) => {
    setModules(modules.map((m) => 
      m.id === moduleId 
        ? { ...m, requirements: [...m.requirements, ""] }
        : m
    ))
  }

  const updateRequirement = (moduleId: string, index: number, value: string) => {
    setModules(modules.map((m) => 
      m.id === moduleId 
        ? { ...m, requirements: m.requirements.map((r, i) => (i === index ? value : r)) }
        : m
    ))
  }

  const removeRequirement = (moduleId: string, index: number) => {
    setModules(modules.map((m) => 
      m.id === moduleId && m.requirements.length > 1
        ? { ...m, requirements: m.requirements.filter((_, i) => i !== index) }
        : m
    ))
  }

  const handleSave = () => {
    // In production, save to database
    router.push("/regulator/frameworks")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link 
            href="/regulator/frameworks" 
            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Frameworks
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create New Framework</h1>
          <p className="mt-1 text-muted-foreground">
            Build a regulatory compliance framework for fintech entities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Framework
          </Button>
        </div>
      </div>

      {/* Framework Details */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Framework Details</CardTitle>
          <CardDescription>Basic information about the compliance framework</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Framework Name</Label>
              <Input
                id="name"
                placeholder="e.g., Digital Credit Provider Compliance Framework"
                value={frameworkName}
                onChange={(e) => setFrameworkName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity">Target Entity Type</Label>
              <Select value={targetEntity} onValueChange={setTargetEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dcp">Digital Credit Provider</SelectItem>
                  <SelectItem value="psp">Payment Service Provider</SelectItem>
                  <SelectItem value="mmo">Mobile Money Operator</SelectItem>
                  <SelectItem value="forex">Foreign Exchange Bureau</SelectItem>
                  <SelectItem value="mfb">Microfinance Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and scope of this framework..."
              value={frameworkDescription}
              onChange={(e) => setFrameworkDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Templates */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Add Modules</CardTitle>
          <CardDescription>Select from common compliance module templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {moduleTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() => {
                  setModules([
                    ...modules,
                    { 
                      id: Date.now().toString(), 
                      name: template.name, 
                      description: "", 
                      requirements: [""] 
                    },
                  ])
                }}
              >
                <Plus className="mr-1 h-3 w-3" />
                {template.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Framework Modules</h2>
          <Button variant="outline" size="sm" onClick={addModule} className="bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </div>

        {modules.map((module, moduleIndex) => (
          <Card key={module.id} className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-sm font-medium text-primary">
                    {moduleIndex + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeModule(module.id)}
                  disabled={modules.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Module Name</Label>
                  <Input
                    placeholder="e.g., Licensing Requirements"
                    value={module.name}
                    onChange={(e) => updateModule(module.id, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description of this module"
                    value={module.description}
                    onChange={(e) => updateModule(module.id, "description", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="space-y-2">
                  {module.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="flex gap-2">
                      <Input
                        placeholder={`Requirement ${reqIndex + 1}`}
                        value={req}
                        onChange={(e) => updateRequirement(module.id, reqIndex, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(module.id, reqIndex)}
                        disabled={module.requirements.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addRequirement(module.id)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Requirement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="bg-transparent" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSave}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Framework
        </Button>
      </div>
    </div>
  )
}
