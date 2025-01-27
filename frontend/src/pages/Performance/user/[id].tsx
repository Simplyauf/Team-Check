// src/pages/performance/[id].tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceProfile() {
  const [performanceData] = useState({
    employee: {
      id: "1",
      name: "John Doe",
      role: "Senior Developer",
      department: "Engineering",
    },
    currentScore: 4.2,
    historicalScores: [
      { month: "Jan", score: 4.0 },
      { month: "Feb", score: 4.1 },
      { month: "Mar", score: 4.2 },
      { month: "Apr", score: 4.3 },
      { month: "May", score: 4.2 },
      { month: "Jun", score: 4.4 },
      { month: "Jul", score: 4.3 },
    ],
    recentEvaluations: [
      {
        id: "1",
        project: "Website Redesign",
        date: "2024-02-15",
        score: 4.5,
      },
      {
        id: "2",
        project: "API Integration",
        date: "2024-01-20",
        score: 4.2,
      },
      {
        id: "3",
        project: "Mobile App Update",
        date: "2023-12-10",
        score: 4.3,
      },
    ],
    skillsBreakdown: {
      technical: 4.5,
      collaboration: 4.2,
      communication: 4.0,
      initiative: 4.3,
      delivery: 4.1,
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {performanceData.employee.name}
          </h2>
          <p className="text-muted-foreground">
            {performanceData.employee.role} •{" "}
            {performanceData.employee.department}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                {performanceData.currentScore}/5.0
              </div>
              <Progress
                value={(performanceData.currentScore / 5) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Trend Card */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData.historicalScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(performanceData.skillsBreakdown).map(
              ([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize">
                      {skill.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span>{score}/5</span>
                  </div>
                  <Progress value={(score / 5) * 100} className="h-2" />
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Evaluations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.recentEvaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="flex justify-between items-center p-4 rounded-lg border"
              >
                <div>
                  <div className="font-medium">{evaluation.project}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(evaluation.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  {evaluation.score}/5
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
