// src/pages/projects/[id].tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  Activity,
  Star,
  Edit,
  Plus,
  Settings,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { MilestoneDialog } from "@/components/projects/MilestoneDialog";
import { TeamManagementDialog } from "@/components/projects/TeamManagementDialog";
import ProjectSettings from "@/components/projects/settings";

interface Milestone {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
  dueDate: string;
  description: string;
  assignee: string;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showTeamManagementDialog, setShowTeamManagementDialog] =
    useState(false);

  const [project, setProject] = useState({
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern UI/UX",
    status: "active",
    progress: 75,
    team: "Design Engineering",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    priority: "high",
    teamMembers: [
      {
        id: "1",
        name: "John Doe",
        role: "Lead Developer",
        avatar: "/avatars/john.png",
      },
      {
        id: "2",
        name: "Jane Smith",
        role: "UI Designer",
        avatar: "/avatars/jane.png",
      },
    ],
    milestones: [
      {
        id: "1",
        title: "Requirements Gathering",
        status: "completed",
        dueDate: "2024-02-15",
        description: "Collect and analyze project requirements",
        assignee: "John Doe",
      },
      // ... more milestones
    ],
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h2>
            <p className="text-muted-foreground">{project.team}</p>
          </div>
        </div>
        <Button onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 w-4 h-4" /> Edit Project
        </Button>
      </div>

      {/* Project Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant="default">{project.status}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Priority</div>
              <Badge
                variant={
                  project.priority === "high" ? "destructive" : "default"
                }
              >
                {project.priority}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Timeline</div>
              <div className="text-sm">
                {new Date(project.startDate).toLocaleDateString()} -{" "}
                {new Date(project.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Progress</div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="mr-2 w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="milestones">
            <Target className="mr-2 w-4 h-4" /> Milestones
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 w-4 h-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 w-4 h-4" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Project Milestones</h3>
            <Button onClick={() => setShowMilestoneDialog(true)}>
              <Plus className="mr-2 w-4 h-4" /> Add Milestone
            </Button>
          </div>
          <div className="space-y-4">
            {project.milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="font-medium">{milestone.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Team Members</CardTitle>
              <Button
                onClick={() => setShowTeamManagementDialog(true)}
                variant="outline"
              >
                Manage Team
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.teamMembers.map((member) => (
                  <div key={member.id} className="flex gap-4 items-center">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectSettings
                project={project}
                onSave={() => {
                  // Handle settings update
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Project Dialog */}
      {showEditDialog && (
        <EditProjectDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          project={project}
          onSave={() => {}}
        />
      )}

      {/* ... Edit Dialog Content ... */}
      {showMilestoneDialog && (
        <MilestoneDialog
          open={showMilestoneDialog}
          onOpenChange={setShowMilestoneDialog}
          teamMembers={project.teamMembers}
          onSave={() => {}}
        />
      )}

      {showTeamManagementDialog && (
        <TeamManagementDialog
          open={showTeamManagementDialog}
          onOpenChange={setShowTeamManagementDialog}
          availableMembers={[]}
          currentTeam={project.teamMembers}
          onSave={() => {}}
        />
      )}

      {/* Add Milestone Dialog */}

      {/* ... Milestone Dialog Content ... */}
    </div>
  );
}
