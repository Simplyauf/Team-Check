import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MVP() {
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "Starter",
      price: "$2",
      period: "per employee/month",
      features: [
        "Automated Check-in/Check-out",
        "Team Calendar View",
        "Basic Leave Management",
        "Attendance Tracking",
        "Email Notifications",
        "Basic Analytics Dashboard",
        "Up to 50 team members",
      ],
    },
    {
      name: "Enterprise",
      price: "$4",
      period: "per employee/month",
      features: [
        "Everything in Starter, plus:",
        "Performance Evaluation System",
        "Custom Workflows & Approvals",
        "Advanced Analytics & Reports",
        "Slack/Teams/WhatsApp Integration",
        "Project Time Tracking",
        "Custom Roles & Permissions",
        "Priority 24/7 Support",
        "Unlimited team members",
      ],
    },
  ];

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Track which plan was selected along with the email
    console.log("Plan Selected:", selectedPlan);
    console.log("Email Submitted:", email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container px-4 py-24 mx-auto text-center">
        <Badge variant="secondary" className="mb-4">
          Early Access Now Open
        </Badge>
        <h1 className="mb-6 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Transform Your Team Management
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-gray-600">
          Replace manual tracking and endless meetings with smart automation.
          Get real-time insights into team productivity and performance.
        </p>

        {/* Early Access Form */}
        <form onSubmit={handleEmailSubmit} className="mx-auto mb-16 max-w-md">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Free Trial
            </Button>
          </div>
        </form>

        {/* Features Grid */}
        <div className="grid gap-8 mx-auto mb-24 max-w-6xl md:grid-cols-3">
          {[
            {
              title: "Smart Check-ins",
              description:
                "Automated daily updates across Slack, Teams, or WhatsApp",
              icon: "⚡",
            },
            {
              title: "Team Calendar",
              description:
                "Visual overview of team availability and activities",
              icon: "📅",
            },
            {
              title: "Performance Tracking",
              description: "Measure and improve team productivity",
              icon: "📈",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <h2 className="mb-12 text-4xl font-bold text-center">
          Simple, Transparent Pricing
        </h2>
        <div className="grid gap-8 mx-auto max-w-5xl md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`transform transition-all hover:scale-105 ${
                selectedPlan === plan.name ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <CardHeader className="text-center">
                <CardTitle className="mb-2 text-2xl">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-gray-600">{plan.period}</span>
                </div>
                <Button
                  className={
                    plan.name === "Enterprise" ? "bg-blue-600" : "bg-gray-600"
                  }
                >
                  Get Started
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="flex-shrink-0 mr-2 w-5 h-5 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
