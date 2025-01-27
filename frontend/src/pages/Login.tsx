import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { user } = await login(credentialResponse.credential);

      // Check if user has any workspaces
      if (!user.workspaces?.length) {
        // New user - redirect to workspace setup
        navigate("/workspace-setup");
      } else if (user.workspaces.length === 1) {
        // Single workspace - direct login
        navigate("/dashboard");
      } else {
        // Multiple workspaces - let user choose
        navigate("/workspace-select");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    const data = fetch("http://localhost:3000/health");
    const data3 = axios.post("http://localhost:3000/test-post", {
      name: "John",
      age: 30,
    });
    // const data2 = fetch("http://localhost:3000/test-post", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ name: "John", age: 30 }),
    // });
    // console.log(data2);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md border border-gray-100">
        <CardHeader className="text-2xl font-bold text-center">
          Welcome to Teamzly
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
