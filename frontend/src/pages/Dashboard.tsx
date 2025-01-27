import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users, AlertCircle, User, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Dashboard() {
  const checkIns = [
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration and documentation",
      team: "Engineering",
    },
    // ... more check-ins
  ];

  const teamUpdates = [
    {
      team: "Engineering",
      update: "API Gateway phase 1 completed - 85% progress",
      timestamp: "2 hours ago",
    },
    // ... more updates
  ];

  const leaveEvents = [
    {
      type: "On Leave",
      user: "Mike Wilson",
      dates: "Today - Apr 25",
      reason: "Vacation",
    },
    {
      type: "Upcoming Leave",
      user: "Emma Clark",
      dates: "Apr 28 - May 2",
      reason: "Personal",
    },
  ];

  const attendanceStats = [
    { label: "Checked Out", count: 15, variant: "default" },
    { label: "Late Check-in", count: 3, variant: "warning" },
    { label: "Late Check-out", count: 2, variant: "warning" },
    { label: "On Leave", count: 4, variant: "secondary" },
    { label: "On Break", count: 2, variant: "outline" },
  ];

  const [selectedStat, setSelectedStat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const yesterdayCheckouts = [
    {
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      time: "5:30 PM",
      project: "Project Atlas",
      summary: "Completed API documentation",
      team: "Engineering",
    },
    // ... more checkouts
  ];

  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [leaveFilter, setLeaveFilter] = useState<string | null>(null);

  return (
    <Tabs defaultValue="check-ins" className="w-full">
      <div className="flex-1">
        <div className="sticky top-0 z-10 border-b backdrop-blur-sm bg-background/80">
          <div className="flex justify-between items-center p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button variant="outline">Customize</Button>
          </div>
          <TabsList className="justify-start p-0 pl-8 h-auto bg-transparent border-b border-border">
            <TabsTrigger
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 pb-2"
              value="check-ins"
            >
              Check-ins
            </TabsTrigger>
            <TabsTrigger
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 pb-2"
              value="team-activity"
            >
              Team Activity
            </TabsTrigger>
            <TabsTrigger
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 pb-2"
              value="leave-events"
            >
              Leave & Events
            </TabsTrigger>
            <TabsTrigger
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 pb-2"
              value="performance"
            >
              Performance Reviews
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-8 pt-0 space-y-6">
          <TabsContent value="check-ins" className="mt-6">
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search check-ins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                  <div className="flex flex-wrap gap-2">
                    {attendanceStats.map((stat, i) => (
                      <Badge
                        key={i}
                        variant={stat.variant}
                        className={cn(
                          "cursor-pointer text-sm",
                          selectedStat === stat.label && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedStat(stat.label)}
                      >
                        {stat.label} ({stat.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {selectedStat && (
                <Card className="p-4">
                  <h3 className="mb-4 font-medium">{selectedStat} Employees</h3>
                  <div className="space-y-4">
                    {checkIns
                      .filter((checkin) => checkin.status === selectedStat)
                      .map((checkin, i) => (
                        <div
                          key={i}
                          className="flex items-start p-2 space-x-4 rounded-lg hover:bg-muted"
                        >
                          <Avatar>
                            <AvatarImage src={checkin.avatar} />
                            <AvatarFallback>{checkin.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex gap-2 items-center">
                              <span className="font-medium">
                                {checkin.user}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {checkin.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {checkin.status === "On Leave"
                                ? checkin.reason
                                : checkin.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex gap-2 items-center text-base">
                      <Clock className="w-5 h-5" />
                      Today's Check-ins
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="space-y-4">
                      {checkIns.slice(0, 5).map((checkin, i) => (
                        <div
                          key={i}
                          className="flex items-start p-2 space-x-4 rounded-lg hover:bg-muted"
                        >
                          <Avatar>
                            <AvatarImage src={checkin.avatar} />
                            <AvatarFallback>{checkin.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex gap-2 items-center">
                              <span className="font-medium">
                                {checkin.user}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {checkin.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {checkin.project} - {checkin.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex gap-2 items-center text-base">
                      <Clock className="w-5 h-5" />
                      Yesterday's Checkouts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="space-y-4">
                      {yesterdayCheckouts.map((checkout, i) => (
                        <div
                          key={i}
                          className="flex items-start p-2 space-x-4 rounded-lg hover:bg-muted"
                        >
                          <Avatar>
                            <AvatarImage src={checkout.avatar} />
                            <AvatarFallback>{checkout.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex gap-2 items-center">
                              <span className="font-medium">
                                {checkout.user}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {checkout.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {checkout.project} - {checkout.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team-activity" className="mt-6">
            <div className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="Search team activities..."
                      className="max-w-md"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setTeamFilter("new-team")}
                      >
                        New Team
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setTeamFilter("completed-project")}
                      >
                        Completed Project
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setTeamFilter("project-milestone")}
                      >
                        Project Milestone
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setTeamFilter("team-modification")}
                      >
                        Team Changes
                      </Badge>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                      <Users className="w-5 h-5" />
                      Team Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamUpdates.map((update, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{update.team}</span>
                            <span className="text-sm text-muted-foreground">
                              {update.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {update.update}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leave-events" className="mt-6">
            <div className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="Search leave & events..."
                      className="max-w-md"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "cursor-pointer",
                          leaveFilter === "upcoming" && "ring-2 ring-primary"
                        )}
                        onClick={() => setLeaveFilter("upcoming")}
                      >
                        Upcoming Leave
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "cursor-pointer",
                          leaveFilter === "current" && "ring-2 ring-primary"
                        )}
                        onClick={() => setLeaveFilter("current")}
                      >
                        Currently On Leave
                      </Badge>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                      <Calendar className="w-5 h-5" />
                      Leave & Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {leaveEvents.map((event, i) => (
                        <div
                          key={i}
                          className="flex items-start p-2 space-x-4 rounded-lg hover:bg-muted"
                        >
                          <AlertCircle className="w-5 h-5 text-muted-foreground" />
                          <div className="space-y-1">
                            <Badge variant="outline">{event.type}</Badge>
                            <p className="font-medium">{event.user}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.dates}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {event.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Performance Review Status
              </h2>
              <div className="grid gap-4">
                <Card className="p-4">
                  <Input
                    placeholder="Search performance reviews..."
                    className="max-w-md"
                  />
                </Card>
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                      <Star className="w-5 h-5" />
                      Upcoming Performance Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[
                        {
                          user: "Alex Thompson",
                          avatar: "/avatars/alex.jpg",
                          position: "Frontend Developer",
                          reviewDate: "May 1, 2024",
                          reviewType: "Quarterly Review",
                          reviewer: "John Doe",
                        },
                        {
                          user: "Maria Garcia",
                          avatar: "/avatars/maria.jpg",
                          position: "Backend Developer",
                          reviewDate: "May 3, 2024",
                          reviewType: "Project Completion",
                          reviewer: "Jane Smith",
                        },
                      ].map((review, i) => (
                        <div
                          key={i}
                          className="flex items-start p-4 space-x-4 rounded-lg border"
                        >
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <span className="font-medium">{review.user}</span>
                              <Badge variant="outline">
                                {review.reviewType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.position}
                            </p>
                            <div className="flex gap-2 items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {review.reviewDate}
                            </div>
                            <div className="flex gap-2 items-center text-sm text-muted-foreground">
                              <User className="w-4 h-4" />
                              Reviewer: {review.reviewer}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
