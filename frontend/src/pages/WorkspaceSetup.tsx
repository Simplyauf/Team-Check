import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function WorkspaceSetup() {
  const navigate = useNavigate();
  const { createWorkspace, loading, error } = useWorkspace();
  const [formData, setFormData] = useState({
    workspaceName: "",
    workspaceSubdomain: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWorkspace(formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Workspace setup failed:", error);
    }
  };

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
            <Button type="submit" className="w-full">
              Create Workspace
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
