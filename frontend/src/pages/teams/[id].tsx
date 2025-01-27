import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  Settings,
  LayoutGrid,
  Activity,
  Shield,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // This would come from your API
  const team = {
    id: 1,
    name: "Engineering",
    description: "Product development team",
    memberCount: 8,
    leadName: "John Doe",
    status: "active",
    hierarchy: "Product > Engineering",
    projects: 12,
    avatar: "/teams/engineering.png",
    members: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Team Lead",
        avatar: "/avatars/john.png",
        joinedAt: "2023-01-15",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Senior Developer",
        avatar: "/avatars/jane.png",
        joinedAt: "2023-02-01",
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: "member_added",
        description: "Jane Smith joined the team",
        timestamp: "2024-03-15T10:00:00",
      },
      {
        id: 2,
        type: "project_created",
        description: "New project 'Dashboard Redesign' created",
        timestamp: "2024-03-14T15:30:00",
      },
    ],
    projects: [
      {
        id: 1,
        name: "Dashboard Redesign",
        status: "In Progress",
        progress: 60,
      },
      {
        id: 2,
        name: "API Integration",
        status: "Planning",
        progress: 20,
      },
    ],
  };

  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/teams")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{team.name}</h2>
            <p className="text-sm text-muted-foreground">{team.hierarchy}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline">
            <Users className="mr-2 w-4 h-4" />
            Add Member
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.memberCount}</div>
          </CardContent>
        </Card>
        {/* Add more stat cards */}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutGrid className="mr-2 w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 w-4 h-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="mr-2 w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-2 w-4 h-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            <CardContent>{/* Add team details and projects */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="flex gap-2 items-center">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.joinedAt}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          {/* Add permissions management */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
