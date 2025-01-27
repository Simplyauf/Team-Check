// src/pages/projects/index.tsx
import { useState } from "react";
import {
  Plus,
  Calendar,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Target,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  team: string;
  startDate: string;
  endDate: string;
  milestones: number;
  completedMilestones: number;
  teamMembers: string[];
  priority: "high" | "medium" | "low";
}

export default function Projects() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    team: "",
    startDate: "",
    endDate: "",
    priority: "medium",
  });

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern UI/UX",
      status: "active",
      progress: 75,
      team: "Design Engineering",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      milestones: 10,
      completedMilestones: 7,
      teamMembers: ["John Doe", "Jane Smith", "Mike Johnson"],
      priority: "high",
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "New mobile application for customer engagement",
      status: "active",
      progress: 30,
      team: "Mobile Team",
      startDate: "2024-02-15",
      endDate: "2024-08-30",
      milestones: 8,
      completedMilestones: 2,
      teamMembers: ["Sarah Wilson", "Tom Brown"],
      priority: "medium",
    },
    // Add more dummy projects
  ]);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showMilestonesDialog, setShowMilestonesDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreateProject = () => {
    // Add project creation logic here
    setShowCreateDialog(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage and track your team's projects
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 w-4 h-4" /> Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Project Name</label>
                <Input
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  placeholder="Enter project name"
                />
              </div>
              <div className="grid gap-2">
                <label>Description</label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  placeholder="Project description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label>Start Date</label>
                  <Input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label>End Date</label>
                  <Input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) =>
                      setNewProject({ ...newProject, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label>Team</label>
                <Select
                  value={newProject.team}
                  onValueChange={(value) =>
                    setNewProject({ ...newProject, team: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design Engineering</SelectItem>
                    <SelectItem value="mobile">Mobile Team</SelectItem>
                    <SelectItem value="backend">Backend Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Priority</label>
                <Select
                  value={newProject.priority}
                  onValueChange={(value) =>
                    setNewProject({ ...newProject, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">
                {project.name}
                <Badge
                  variant={
                    project.priority === "high"
                      ? "destructive"
                      : project.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                  className="ml-2"
                >
                  {project.priority}
                </Badge>
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <Eye className="mr-2 w-4 h-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedProject(project);
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="mr-2 w-4 h-4" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedProject(project);
                      setShowTeamDialog(true);
                    }}
                  >
                    <Users className="mr-2 w-4 h-4" />
                    Manage Team
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedProject(project);
                      setShowMilestonesDialog(true);
                    }}
                  >
                    <Target className="mr-2 w-4 h-4" />
                    Milestones
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-2 items-center">
                    <Users className="w-4 h-4" />
                    <span>{project.teamMembers.length} members</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Target className="w-4 h-4" />
                    <span>
                      {project.completedMilestones}/{project.milestones}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                  <span>→</span>
                  <span>{new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Project Name</label>
                <Input defaultValue={selectedProject.name} />
              </div>
              <div className="grid gap-2">
                <label>Description</label>
                <Textarea defaultValue={selectedProject.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label>Start Date</label>
                  <Input type="date" defaultValue={selectedProject.startDate} />
                </div>
                <div className="grid gap-2">
                  <label>End Date</label>
                  <Input type="date" defaultValue={selectedProject.endDate} />
                </div>
              </div>
              <div className="grid gap-2">
                <label>Status</label>
                <Select defaultValue={selectedProject.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Priority</label>
                <Select defaultValue={selectedProject.priority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Team Dialog */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Team Members</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Current Team Members</div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Member
                </Button>
              </div>
              <div className="space-y-4">
                {selectedProject.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member}</div>
                        <div className="text-sm text-muted-foreground">
                          Team Member
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Milestones Dialog */}
      <Dialog
        open={showMilestonesDialog}
        onOpenChange={setShowMilestonesDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Project Milestones</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Overall Progress</div>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (selectedProject.completedMilestones /
                        selectedProject.milestones) *
                        100
                    )}
                    %
                  </div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Add Milestone
                </Button>
              </div>
              <Progress
                value={
                  (selectedProject.completedMilestones /
                    selectedProject.milestones) *
                  100
                }
                className="h-2"
              />
              <div className="space-y-2">
                {/* Example milestones - you'll need to add these to your Project interface */}
                {[
                  {
                    id: 1,
                    title: "Requirements Gathering",
                    status: "completed",
                    dueDate: "2024-02-15",
                  },
                  {
                    id: 2,
                    title: "Design Phase",
                    status: "in-progress",
                    dueDate: "2024-03-15",
                  },
                  {
                    id: 3,
                    title: "Development",
                    status: "pending",
                    dueDate: "2024-05-15",
                  },
                ].map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
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
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
