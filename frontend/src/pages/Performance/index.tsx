// src/pages/performance/index.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { PerformanceList } from "@/components/performance/PerformanceList";
import { UsersList } from "@/components/performance/UsersList";
import NewEvaluationDialog from "@/components/performance/NewEvaluationDialog";
import { useNavigate } from "react-router-dom";

export default function Performance() {
  const [showNewEvaluation, setShowNewEvaluation] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance</h2>
          <p className="text-muted-foreground">
            Manage and track performance evaluations
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewEvaluation(true)}>
            <Plus className="mr-2 w-4 h-4" /> New Evaluation
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/performance/settings")}
          >
            <Settings className="mr-2 w-4 h-4" /> Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="evaluations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations">
          <PerformanceList />
        </TabsContent>

        <TabsContent value="users">
          <UsersList />
        </TabsContent>
      </Tabs>

      <NewEvaluationDialog
        open={showNewEvaluation}
        onOpenChange={setShowNewEvaluation}
      />
    </div>
  );
}
