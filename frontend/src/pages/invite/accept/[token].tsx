import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function InviteAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteDetails, setInviteDetails] = useState<any>(null);

  useEffect(() => {
    fetchInviteDetails();
  }, [token]);

  const fetchInviteDetails = async () => {
    try {
      const response = await api.get(`/invites/details/${token}`);
      setInviteDetails(response.data.data);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Invalid or expired invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      await api.post(`/invites/accept/${token}`);
      toast({
        title: "Success",
        description: "Invitation accepted successfully",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await api.post(`/invites/reject/${token}`);
      toast({
        title: "Success",
        description: "Invitation rejected successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to reject invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Workspace Invitation</CardTitle>
          <CardDescription>
            You've been invited to join {inviteDetails?.workspace?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Invited by</p>
              <p>{inviteDetails?.invitedBy?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p>{inviteDetails?.role?.name}</p>
            </div>
            {inviteDetails?.position && (
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p>{inviteDetails?.position}</p>
              </div>
            )}
            <div className="flex space-x-4">
              <Button onClick={handleAccept} disabled={loading}>
                {loading ? "Processing..." : "Accept Invitation"}
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                disabled={loading}
              >
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
