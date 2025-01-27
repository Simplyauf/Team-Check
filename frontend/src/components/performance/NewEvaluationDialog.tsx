// src/pages/performance/new.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface NewEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EVALUATION_CRITERIA = [
  {
    id: "technical",
    label: "Technical Skills",
    description: "Technical knowledge and ability to apply it effectively",
  },
  {
    id: "collaboration",
    label: "Team Collaboration",
    description: "Ability to work effectively with team members",
  },
  {
    id: "communication",
    label: "Communication",
    description: "Clear and effective communication with team and stakeholders",
  },
  {
    id: "initiative",
    label: "Initiative & Innovation",
    description: "Proactive approach and innovative problem-solving",
  },
  {
    id: "delivery",
    label: "Delivery & Quality",
    description: "Timely delivery of high-quality work",
  },
];

export default function NewEvaluationDialog({
  open,
  onOpenChange,
}: NewEvaluationDialogProps) {
  const [evaluation, setEvaluation] = useState({
    employeeId: "",
    projectId: "",
    period: "",
    ratings: {},
    strengths: "",
    improvements: "",
    goals: "",
  });

  const handleSubmit = () => {
    // Handle submission logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Evaluation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Employee</label>
                  <Select
                    value={evaluation.employeeId}
                    onValueChange={(value) =>
                      setEvaluation({ ...evaluation, employeeId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">John Doe</SelectItem>
                      <SelectItem value="2">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label>Project</label>
                  <Select
                    value={evaluation.projectId}
                    onValueChange={(value) =>
                      setEvaluation({ ...evaluation, projectId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Website Redesign</SelectItem>
                      <SelectItem value="2">Mobile App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {EVALUATION_CRITERIA.map((criteria) => (
                <div key={criteria.id} className="space-y-4">
                  <div>
                    <h4 className="font-medium">{criteria.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {criteria.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[evaluation.ratings[criteria.id] || 0]}
                      onValueChange={(value) =>
                        setEvaluation({
                          ...evaluation,
                          ratings: {
                            ...evaluation.ratings,
                            [criteria.id]: value[0],
                          },
                        })
                      }
                      max={5}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Needs Improvement</span>
                      <span>Exceptional</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Feedback & Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label>Key Strengths</label>
                <Textarea
                  value={evaluation.strengths}
                  onChange={(e) =>
                    setEvaluation({ ...evaluation, strengths: e.target.value })
                  }
                  placeholder="What are the employee's key strengths?"
                />
              </div>
              <div className="space-y-2">
                <label>Areas for Improvement</label>
                <Textarea
                  value={evaluation.improvements}
                  onChange={(e) =>
                    setEvaluation({
                      ...evaluation,
                      improvements: e.target.value,
                    })
                  }
                  placeholder="What areas need improvement?"
                />
              </div>
              <div className="space-y-2">
                <label>Development Goals</label>
                <Textarea
                  value={evaluation.goals}
                  onChange={(e) =>
                    setEvaluation({ ...evaluation, goals: e.target.value })
                  }
                  placeholder="What are the development goals for the next period?"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Evaluation</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
