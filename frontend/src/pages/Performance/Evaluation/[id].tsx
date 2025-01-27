import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Target,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EvaluationDetail() {
  const navigate = useNavigate();
  const [evaluation] = useState({
    id: "1",
    status: "completed",
    date: "2024-03-15",
    employee: {
      name: "John Doe",
      role: "Senior Developer",
      department: "Engineering",
      avatar: "JD",
    },
    evaluator: {
      name: "Jane Smith",
      role: "Engineering Manager",
      avatar: "JS",
    },
    project: "Website Redesign",
    ratings: {
      technical: 4.5,
      collaboration: 4.2,
      communication: 4.0,
      initiative: 4.3,
      delivery: 4.1,
    },
    feedback: {
      strengths:
        "Excellent problem-solving skills and technical expertise. Takes initiative in identifying and resolving complex issues.",
      improvements:
        "Could improve on documentation and knowledge sharing with junior team members.",
      goals:
        "Focus on mentoring junior developers and improving technical documentation practices.",
    },
    comments: [
      {
        author: "Jane Smith",
        date: "2024-03-15",
        content: "Great work on the recent project deliverables.",
      },
    ],
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/performance")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Evaluations
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Performance Evaluation
          </h2>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                evaluation.status === "completed" ? "success" : "secondary"
              }
            >
              {evaluation.status}
            </Badge>
            <span className="text-muted-foreground">
              {new Date(evaluation.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Employee and Evaluator Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{evaluation.employee.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{evaluation.employee.name}</div>
              <div className="text-sm text-muted-foreground">
                {evaluation.employee.role} • {evaluation.employee.department}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evaluator</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{evaluation.evaluator.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{evaluation.evaluator.name}</div>
              <div className="text-sm text-muted-foreground">
                {evaluation.evaluator.role}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="ratings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Performance Ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(evaluation.ratings).map(([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize">
                      {skill.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="font-medium">{score}/5</span>
                  </div>
                  <Progress value={(score / 5) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{evaluation.feedback.strengths}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{evaluation.feedback.improvements}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Development Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{evaluation.feedback.goals}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluation.comments.map((comment, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg border">
                  <Avatar>
                    <AvatarFallback>
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
