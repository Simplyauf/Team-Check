import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

interface LeaveBalanceCardProps {
  balances: LeaveBalance[];
}

export function LeaveBalanceCard({ balances }: LeaveBalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {balances.map((balance) => (
          <div key={balance.type} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{balance.type}</span>
              <span className="text-sm text-muted-foreground">
                {balance.used}/{balance.total} days used
              </span>
            </div>
            <Progress value={(balance.used / balance.total) * 100} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{balance.pending} pending</span>
              <span>{balance.remaining} remaining</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
