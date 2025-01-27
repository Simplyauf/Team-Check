// src/pages/projects/settings.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ProjectSettings() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Project Settings</h2>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label>Project Visibility</label>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div>Public Project</div>
                  <div className="text-sm text-muted-foreground">
                    Allow all team members to view this project
                  </div>
                </div>
                <Switch />
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <label>Project Tags</label>
              <div className="flex gap-2">
                <Badge>Frontend</Badge>
                <Badge>UI/UX</Badge>
                <Badge>Development</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div>Milestone Updates</div>
                <div className="text-sm text-muted-foreground">
                  Receive notifications for milestone changes
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div>Team Member Changes</div>
                <div className="text-sm text-muted-foreground">
                  Notify when team members are added or removed
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div>Edit Project Details</div>
                  <div className="text-sm text-muted-foreground">
                    Who can edit project information
                  </div>
                </div>
                <select className="form-select">
                  <option>Project Managers Only</option>
                  <option>Team Leaders</option>
                  <option>All Team Members</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div>Manage Milestones</div>
                  <div className="text-sm text-muted-foreground">
                    Who can create and edit milestones
                  </div>
                </div>
                <select className="form-select">
                  <option>Project Managers Only</option>
                  <option>Team Leaders</option>
                  <option>All Team Members</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
