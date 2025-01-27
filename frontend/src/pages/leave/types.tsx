import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([
    {
      id: "1",
      name: "Vacation",
      daysAllowed: 20,
      carryForward: true,
      requiresApproval: true,
      minNoticeDays: 7,
      description: "Annual vacation leave",
      accrualRate: "1.67 days/month",
      maxCarryForward: 5,
    },
    {
      id: "2",
      name: "Sick Leave",
      daysAllowed: 10,
      carryForward: false,
      requiresApproval: false,
      minNoticeDays: 0,
      description: "Medical and health-related leave",
      accrualRate: "0.83 days/month",
      maxCarryForward: 0,
    },
  ]);

  const [editingType, setEditingType] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Types</h2>
          <p className="text-sm text-muted-foreground">
            Configure and manage different types of leave in your organization
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingType(null);
            setShowEditDialog(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Leave Type
        </Button>
      </div>

      <div className="grid gap-6">
        {leaveTypes.map((type) => (
          <Card key={type.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl">{type.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingType(type);
                    setShowEditDialog(true);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <Label>Annual Allowance</Label>
                  <div className="font-medium">
                    {type.daysAllowed} days/year
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Accrues at {type.accrualRate}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Carry Forward</Label>
                  <div className="font-medium">
                    {type.carryForward
                      ? `Up to ${type.maxCarryForward} days`
                      : "Not allowed"}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Notice Period</Label>
                  <div className="font-medium">
                    {type.minNoticeDays > 0
                      ? `${type.minNoticeDays} days required`
                      : "No notice required"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Leave Type" : "Add Leave Type"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="e.g. Vacation Leave" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of this leave type"
              />
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="daysAllowed">Days Allowed</Label>
                <Input id="daysAllowed" type="number" placeholder="20" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minNotice">Minimum Notice (Days)</Label>
                <Input id="minNotice" type="number" placeholder="7" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="carryForward">Allow Carry Forward</Label>
                <Switch id="carryForward" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requiresApproval">Requires Approval</Label>
                <Switch id="requiresApproval" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxCarryForward">
                Maximum Carry Forward Days
              </Label>
              <Input id="maxCarryForward" type="number" placeholder="5" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
