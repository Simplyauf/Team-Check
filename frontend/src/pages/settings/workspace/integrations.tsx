import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slack, MessageSquare, Video } from "lucide-react";

export default function IntegrationsSettings() {
  const integrations = [
    {
      name: "Slack",
      description: "Send notifications and updates to Slack channels",
      icon: Slack,
      connected: true,
    },
    {
      name: "Microsoft Teams",
      description: "Integrate with Microsoft Teams for messaging",
      icon: MessageSquare,
      connected: false,
    },
    {
      name: "Zoom",
      description: "Schedule and manage video meetings",
      icon: Video,
      connected: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect and manage your workspace integrations.
        </p>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="rounded-md border p-2">
                  <integration.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  <Switch checked={integration.connected} />
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardHeader>
            {integration.connected && (
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm">
                    Connected to workspace: Your Workspace
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
