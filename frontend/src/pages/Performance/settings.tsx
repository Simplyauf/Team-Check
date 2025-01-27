// src/pages/performance/settings.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function EvaluationSettings() {
  const [settings, setSettings] = useState({
    evaluationFrequency: "quarterly",
    autoTrigger: true,
    projectCompletion: true,
    milestoneCompletion: false,
    notifyEvaluator: true,
    notifyEmployee: true,
    criteriaWeights: {
      technical: 25,
      collaboration: 20,
      communication: 20,
      initiative: 15,
      delivery: 20,
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Evaluation Settings
          </h2>
          <p className="text-muted-foreground">
            Configure performance evaluation settings
          </p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-6">
        {/* Evaluation Period Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Default Evaluation Frequency</label>
              <Select
                value={settings.evaluationFrequency}
                onValueChange={(value) =>
                  setSettings({ ...settings, evaluationFrequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="biannual">Bi-annual</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Automation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div>Automatic Evaluation Triggers</div>
                <div className="text-sm text-muted-foreground">
                  Automatically create evaluations based on events
                </div>
              </div>
              <Switch
                checked={settings.autoTrigger}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoTrigger: checked })
                }
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>Project Completion</div>
                <Switch
                  checked={settings.projectCompletion}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, projectCompletion: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>Milestone Completion</div>
                <Switch
                  checked={settings.milestoneCompletion}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, milestoneCompletion: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>Notify Evaluators</div>
              <Switch
                checked={settings.notifyEvaluator}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyEvaluator: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>Notify Employees</div>
              <Switch
                checked={settings.notifyEmployee}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyEmployee: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Criteria Weights */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Criteria Weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.criteriaWeights).map(
              ([criteria, weight]) => (
                <div key={criteria} className="space-y-2">
                  <label className="capitalize">
                    {criteria.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          criteriaWeights: {
                            ...settings.criteriaWeights,
                            [criteria]: parseInt(e.target.value),
                          },
                        })
                      }
                      min="0"
                      max="100"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
