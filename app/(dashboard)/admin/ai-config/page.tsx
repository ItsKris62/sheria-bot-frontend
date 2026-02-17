"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Settings, RefreshCw, Save, Zap, Shield, Database } from "lucide-react"

export default function AIConfigPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Configuration</h1>
          <p className="text-muted-foreground mt-1">Configure AI models and response behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Reset to Default</Button>
          <Button className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" />Model Settings</CardTitle>
            <CardDescription>Configure the AI model parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Temperature</Label>
              <div className="flex items-center gap-4">
                <Slider defaultValue={[0.7]} max={1} step={0.1} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12">0.7</span>
              </div>
              <p className="text-xs text-muted-foreground">Controls randomness in responses. Lower = more focused.</p>
            </div>
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input type="number" defaultValue={2048} className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Maximum length of AI responses.</p>
            </div>
            <div className="space-y-2">
              <Label>Response Timeout (seconds)</Label>
              <Input type="number" defaultValue={30} className="bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Safety Settings</CardTitle>
            <CardDescription>Content filtering and safety options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Content Filtering</p>
                <p className="text-xs text-muted-foreground">Filter potentially harmful content</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Source Citations</p>
                <p className="text-xs text-muted-foreground">Always include regulatory sources</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Legal Disclaimer</p>
                <p className="text-xs text-muted-foreground">Add disclaimer to all responses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Confidence Threshold</p>
                <p className="text-xs text-muted-foreground">Minimum confidence for responses</p>
              </div>
              <Badge className="bg-primary/10 text-primary">70%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" />System Prompt</CardTitle>
            <CardDescription>Define the AI assistant behavior and context</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[200px] bg-muted/50 font-mono text-sm"
              defaultValue={`You are SheriaBot, an AI assistant specialized in Kenya's fintech regulatory landscape. Your role is to:

1. Provide accurate information about CBK regulations, Data Protection Act 2019, POCAMLA, and other relevant laws
2. Help users understand compliance requirements for mobile money, PSP licenses, and other fintech services
3. Generate compliance checklists and gap analysis reports
4. Always cite specific regulations and sections when providing guidance
5. Include appropriate disclaimers about seeking professional legal advice

Key regulations you are trained on:
- Central Bank of Kenya Act
- National Payment System Act
- Data Protection Act 2019
- POCAMLA and AML/CFT regulations
- CBK Prudential Guidelines`}
            />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">98.5%</p>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">1.2s</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-sm text-muted-foreground">User Satisfaction</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">12,456</p>
                <p className="text-sm text-muted-foreground">Queries This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
