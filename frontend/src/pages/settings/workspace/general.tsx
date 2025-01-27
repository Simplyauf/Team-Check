import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function WorkspaceGeneralSettings() {
  const { currentWorkspace, updateWorkspace, getWorkspaceDetails, loading } =
    useWorkspace();
  const [settings, setSettings] = useState({
    name: "",
    subdomain: "",
    timezone: "",
    workHours: {
      start: "09:00",
      end: "17:00",
    },
  });

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      try {
        const data = await getWorkspaceDetails(currentWorkspace.id);
        setSettings({
          name: data.name,
          subdomain: data.subdomain,
          timezone: data.settings?.timezone || "UTC",
          workHours: data.settings?.workHours || {
            start: "09:00",
            end: "17:00",
          },
        });
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "Failed to load workspace settings",
        //   variant: "destructive"
        // });
      }
    };

    if (currentWorkspace?.id) {
      fetchWorkspaceDetails();
    }
  }, [currentWorkspace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateWorkspace(currentWorkspace.id, settings);
      // toast({
      //   title: "Success",
      //   description: "Workspace settings updated successfully"
      // });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to update workspace settings",
      //   variant: "destructive"
      // });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subdomain">Workspace URL</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="subdomain"
                    value={settings.subdomain}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        subdomain: e.target.value,
                      }))
                    }
                  />
                  <span>.teamsync.com</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="p-2 w-full rounded-md border"
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  {/* Add more timezones */}
                </select>
              </div>

              <div className="grid gap-2">
                <Label>Work Hours</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="time"
                    value={settings.workHours.start}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        workHours: { ...prev.workHours, start: e.target.value },
                      }))
                    }
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={settings.workHours.end}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        workHours: { ...prev.workHours, end: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
