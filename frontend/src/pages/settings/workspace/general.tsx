import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const DAYS_OF_WEEK = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

// Get all available timezones
const TIMEZONES = Intl.DateTimeFormat().resolvedOptions().timeZone
  ? [Intl.DateTimeFormat().resolvedOptions().timeZone]
  : ["UTC"];

export default function WorkspaceGeneralSettings() {
  const { toast } = useToast();
  const { currentWorkspace, updateWorkspace, getWorkspaceDetails, loading } =
    useWorkspace();

  const [settings, setSettings] = useState({
    name: "",
    subdomain: "",
    settings: {
      timezone: "UTC",
      workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      workingHours: {
        start: "09:00",
        end: "17:00",
      },
    },
  });

  useEffect(() => {
    // Initialize settings from currentWorkspace if available
    if (currentWorkspace?.data?.workspace) {
      const workspace = currentWorkspace.data.workspace;
      setSettings({
        name: workspace.name || "",
        subdomain: workspace.subdomain || "",
        settings: {
          timezone: workspace.settings?.timezone || "UTC",
          workingDays: workspace.settings?.workingDays || [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
          ],
          workingHours: workspace.settings?.workingHours || {
            start: "09:00",
            end: "17:00",
          },
        },
      });
    }
  }, [currentWorkspace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateWorkspace(currentWorkspace?.data?.workspace?.id, {
        name: settings.name,
        subdomain: settings.subdomain,
        settings: settings.settings,
      });

      toast({
        title: "Success",
        description: "Workspace settings updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update workspace settings",
        variant: "destructive",
      });
    }
  };

  if (!currentWorkspace?.data?.workspace?.id) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No workspace selected</p>
      </div>
    );
  }

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
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Basic Information</h4>
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
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Time Settings</h4>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="flex px-3 py-2 w-full h-10 text-sm rounded-md border border-input bg-background ring-offset-background"
                    value={settings.settings.timezone}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          timezone: e.target.value,
                        },
                      }))
                    }
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label>Working Hours</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="time"
                      value={settings.settings.workingHours.start}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            workingHours: {
                              ...prev.settings.workingHours,
                              start: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={settings.settings.workingHours.end}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            workingHours: {
                              ...prev.settings.workingHours,
                              end: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Working Days</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={day.value}
                          checked={settings.settings.workingDays.includes(
                            day.value
                          )}
                          onCheckedChange={(checked) => {
                            setSettings((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                workingDays: checked
                                  ? [...prev.settings.workingDays, day.value]
                                  : prev.settings.workingDays.filter(
                                      (d) => d !== day.value
                                    ),
                              },
                            }));
                          }}
                        />
                        <Label htmlFor={day.value}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
