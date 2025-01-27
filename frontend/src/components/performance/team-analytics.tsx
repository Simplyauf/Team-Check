// src/pages/performance/team-analytics.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function TeamAnalytics() {
  const [teamData] = useState({
    averageScore: 4.1,
    teamMembers: [
      { name: "John Doe", score: 4.5 },
      { name: "Jane Smith", score: 4.2 },
      { name: "Mike Johnson", score: 3.8 },
      // Add more team members
    ],
    performanceTrend: [
      { month: "Jan", score: 4.0 },
      { month: "Feb", score: 4.1 },
      { month: "Mar", score: 4.2 },
      { month: "Apr", score: 4.1 },
      { month: "May", score: 4.3 },
    ],
    skillDistribution: [
      { skill: "Technical", average: 4.2 },
      { skill: "Collaboration", average: 4.4 },
      { skill: "Communication", average: 4.0 },
      { skill: "Initiative", average: 3.9 },
      { skill: "Delivery", average: 4.1 },
    ],
    projectSuccess: [
      {
        project: "Website Redesign",
        completionRate: 95,
        teamScore: 4.3,
      },
      {
        project: "Mobile App",
        completionRate: 80,
        teamScore: 4.1,
      },
      // Add more projects
    ],
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Analytics</h2>
          <p className="text-muted-foreground">
            Team performance metrics and insights
          </p>
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teamData.performanceTrend}>
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

        {/* Skills Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamData.skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="average" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Individual Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamData.teamMembers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="score" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Success Correlation */}
        <Card>
          <CardHeader>
            <CardTitle>Project Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamData.projectSuccess.map((project) => (
                <div
                  key={project.project}
                  className="space-y-2 p-4 border rounded-lg"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{project.project}</span>
                    <span className="text-muted-foreground">
                      Score: {project.teamScore}/5
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>{project.completionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
