import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash } from "lucide-react";

interface LeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveTypeDialog({ open, onOpenChange }: LeaveTypeDialogProps) {
  const [leaveTypes, setLeaveTypes] = useState([
    {
      id: "1",
      name: "Vacation",
      daysAllowed: 20,
      carryForward: true,
      requiresApproval: true,
      minNoticeDays: 7,
    },
    {
      id: "2",
      name: "Sick Leave",
      daysAllowed: 10,
      carryForward: false,
      requiresApproval: false,
      minNoticeDays: 0,
    },
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Leave Types</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Leave Type
          </Button>

          <div className="space-y-4">
            {leaveTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-base font-semibold">
                    {type.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Days Allowed</Label>
                      <div className="font-medium">
                        {type.daysAllowed} days/year
                      </div>
                    </div>
                    <div>
                      <Label>Minimum Notice</Label>
                      <div className="font-medium">
                        {type.minNoticeDays} days
                      </div>
                    </div>
                    <div>
                      <Label>Carry Forward</Label>
                      <div className="font-medium">
                        {type.carryForward ? "Yes" : "No"}
                      </div>
                    </div>
                    <div>
                      <Label>Requires Approval</Label>
                      <div className="font-medium">
                        {type.requiresApproval ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
