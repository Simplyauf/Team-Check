import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { verifyAuth } from "@/store/slices/authSlice";

const DAYS_OF_WEEK = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

export default function WorkspaceSetup() {
  const navigate = useNavigate();
  const { createWorkspace, loading: workspaceLoading, error } = useWorkspace();
  const { user, verifyAuth } = useAuth();
  const [formData, setFormData] = useState({
    workspaceName: "",
    workspaceSubdomain: "",
    settings: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to user's timezone
      workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      workingHours: {
        start: "09:00",
        end: "17:00",
      },
    },
  });

  console.log("WorkspaceSetup Debug:", {
    user,
    formData,
    workspaceLoading,
    error,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting workspace setup:", formData);

    try {
      const result = await createWorkspace({
        name: formData.workspaceName,
        subdomain: formData.workspaceSubdomain,
        settings: formData.settings,
        ownerId: user.id,
      });
      const result2 = await verifyAuth();
      console.log("Workspace creation result:", result);
      navigate("/dashboard");
    } catch (error) {
      console.error("Workspace setup failed:", error);
    }
  };

  const handleWorkingDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        workingDays: prev.settings.workingDays.includes(day)
          ? prev.settings.workingDays.filter((d) => d !== day)
          : [...prev.settings.workingDays, day],
      },
    }));
  };

  if (!user) {
    console.log("No user found in WorkspaceSetup");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            Setup Your Workspace
          </h2>
          <p className="text-sm text-center text-gray-500">
            Create a workspace to get started with TeamSync
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="workspaceName">Workspace Name</label>
              <Input
                id="workspaceName"
                value={formData.workspaceName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workspaceName: e.target.value,
                  }))
                }
                placeholder="My Company"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subdomain">Workspace URL</label>
              <div className="flex items-center space-x-2">
                <Input
                  id="subdomain"
                  value={formData.workspaceSubdomain}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workspaceSubdomain: e.target.value,
                    }))
                  }
                  placeholder="mycompany"
                  required
                />
                <span>.teamsync.com</span>
              </div>
            </div>

            <div className="space-y-2">
              <label>Timezone</label>
              <Select
                value={formData.settings.timezone}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, timezone: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {Intl.supportedValuesOf("timeZone").map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label>Working Days</label>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.value}
                      checked={formData.settings.workingDays.includes(
                        day.value
                      )}
                      onCheckedChange={() => handleWorkingDayToggle(day.value)}
                    />
                    <label htmlFor={day.value}>{day.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label>Working Hours</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={formData.settings.workingHours.start}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                  value={formData.settings.workingHours.end}
                  onChange={(e) =>
                    setFormData((prev) => ({
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

            <Button
              type="submit"
              className="w-full"
              disabled={workspaceLoading}
            >
              {workspaceLoading ? "Creating..." : "Create Workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
