import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import teamling from "/teamling.png";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [surveyData, setSurveyData] = useState({
    challenge: "",
    favoriteFeature: "",
    wishlistFeature: "",
    timeline: "",
    platform: "",
    email: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Left Section - Creative Design */}
      <div className="overflow-hidden relative bg-black">
        <div className="flex flex-row-reverse justify-between items-center w-full">
          <div
            className={`flex justify-center items-center mr-8 transition-all duration-300 z-[50] h-[75px]`}
          >
            <Button
              onClick={() => setShowSurvey(true)}
              className="text-black bg-white hover:bg-white/90"
            >
              Take Survey
            </Button>
          </div>
          <div className={`flex items-center z-[50] :""}`}>
            <img
              src={teamling}
              alt="Teamling"
              className="max-h-[75px] min-w-[75px] max-w-[75px] min-h-[75px]"
            />
            <h2 className="-ml-3 text-2xl font-bold text-white">Teamling</h2>
          </div>
        </div>

        {/* App Name */}

        {/* Abstract Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r rounded-full from-zinc-500 to-zinc-700"></div>
          <div className="absolute top-60 left-60 w-60 h-60 bg-gradient-to-r rounded-full from-zinc-600 to-zinc-800"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r rounded-full from-zinc-700 to-zinc-900"></div>
          {/* Additional Pattern Elements */}
          <div className="absolute right-10 bottom-10 w-32 h-32 bg-gradient-to-r rounded-full from-zinc-400 to-zinc-600"></div>
          <div className="absolute right-40 bottom-40 w-48 h-48 bg-gradient-to-r rounded-full from-zinc-500 to-zinc-700"></div>
        </div>

        {/* Scrollable Feature Boxes */}
        <div className="overflow-y-auto pb-[100px] relative z-10 p-12 h-full">
          {[
            {
              title: "Zero-Meeting Updates",
              description:
                "Eliminate daily standups. Automated check-ins across Slack/Teams/WhatsApp. Save 30+ minutes daily per team.",
              icon: "⚡",
            },
            {
              title: "360° Team Visibility",
              description:
                "Real-time activity dashboard. Instant status updates. Cross-platform team tracking. No more 'What's everyone working on?'",
              icon: "👀",
            },
            {
              title: "Smart Leave Radar",
              description:
                "Automated absence tracking. Team availability forecasting. Instant team notifications. No scheduling surprises.",
              icon: "📅",
            },
            {
              title: "Performance Pulse™",
              description:
                "Project-based team ratings. Automated performance tracking. Data-driven team insights. Make promotion decisions with confidence.",
              icon: "📈",
            },
            {
              title: "One-Click Reports",
              description:
                "Instant productivity insights. Attendance patterns. Team performance metrics. No more manual reporting.",
              icon: "📊",
            },
            // {
            //   title: "Cross-Platform Command Center",
            //   description:
            //     "Manage from anywhere. Unified communications hub. Works where your team works. Single source of truth.",
            //   icon: "🌐",
            // },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex items-start p-6 mb-6 gap-[6px] rounded-2xl border backdrop-blur-lg transition-all transform bg-zinc-900/50 border-zinc-800 hover:scale-[1.02] hover:bg-zinc-900/60"
            >
              <span className="block mb-4 text-3xl">{feature.icon}</span>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Replace Video Popup with Survey Modal */}
        {showSurvey && (
          <div className="flex absolute z-[100] top-0 right-0 justify-center items-center w-full h-full bg-black bg-opacity-75">
            <div className="p-6 h-[90vh] overflow-y-auto w-full max-w-2xl bg-white rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Help Us Build the Future of Team Management!
                  </h2>
                  <p className="text-sm text-zinc-600">
                    We value your input—your feedback shapes our product.
                  </p>
                </div>
                <button
                  onClick={() => setShowSurvey(false)}
                  className="text-zinc-500 hover:text-zinc-500/80"
                >
                  ✖
                </button>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(surveyData);
                  setShowSurvey(false);
                }}
              >
                <div className="space-y-2">
                  <label className="text-base font-medium text-zinc-900">
                    What's your biggest challenge with managing your team?
                  </label>
                  <textarea
                    value={surveyData.challenge}
                    onChange={(e) =>
                      setSurveyData({
                        ...surveyData,
                        challenge: e.target.value,
                      })
                    }
                    className="px-3 py-2 w-full h-20 text-sm rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    placeholder="Tell us about your challenges..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-zinc-900">
                    Which feature excites you the most?
                  </label>
                  <RadioGroup
                    value={surveyData.favoriteFeature}
                    onValueChange={(value) =>
                      setSurveyData({
                        ...surveyData,
                        favoriteFeature: value,
                      })
                    }
                    className="grid grid-cols-1 gap-2"
                  >
                    {[
                      {
                        value: "checkins",
                        label: "Automated Check-Ins",
                        desc: "Zero-Meeting Updates",
                      },
                      {
                        value: "dashboards",
                        label: "Real-Time Dashboards",
                        desc: "360° Team Visibility",
                      },
                      {
                        value: "leave",
                        label: "Smart Leave Management",
                        desc: "Smart Leave Radar",
                      },
                      {
                        value: "performance",
                        label: "Performance Tracking",
                        desc: "Performance Pulse™",
                      },
                      {
                        value: "communications",
                        label: "Unified Communications Hub",
                        desc: "Command Center",
                      },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center p-2 space-x-2 rounded-md hover:bg-zinc-50"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <label
                          htmlFor={option.value}
                          className="flex flex-col cursor-pointer"
                        >
                          <span className="text-sm font-medium text-zinc-900">
                            {option.label}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {option.desc}
                          </span>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-zinc-900">
                    Which communication platform does your team use most often?
                  </label>
                  <RadioGroup
                    value={surveyData.platform}
                    onValueChange={(value) =>
                      setSurveyData({
                        ...surveyData,
                        platform: value,
                      })
                    }
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { value: "slack", label: "Slack" },
                      { value: "teams", label: "Microsoft Teams" },
                      { value: "whatsapp", label: "WhatsApp" },
                      { value: "email", label: "Email" },
                      { value: "other", label: "Other" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center p-2 space-x-2 rounded-md hover:bg-zinc-50"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`platform-${option.value}`}
                        />
                        <label
                          htmlFor={`platform-${option.value}`}
                          className="text-sm font-medium cursor-pointer text-zinc-900"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-zinc-900">
                    How soon would you need a solution like this?
                  </label>
                  <RadioGroup
                    value={surveyData.timeline}
                    onValueChange={(value) =>
                      setSurveyData({
                        ...surveyData,
                        timeline: value,
                      })
                    }
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { value: "asap", label: "ASAP" },
                      { value: "3months", label: "Within 3 months" },
                      { value: "6months", label: "Within 6 months" },
                      { value: "exploring", label: "Just exploring" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center p-2 space-x-2 rounded-md hover:bg-zinc-50"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`timeline-${option.value}`}
                        />
                        <label
                          htmlFor={`timeline-${option.value}`}
                          className="text-sm font-medium cursor-pointer text-zinc-900"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-zinc-900">
                    Your Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={surveyData.email}
                    onChange={(e) =>
                      setSurveyData({
                        ...surveyData,
                        email: e.target.value,
                      })
                    }
                    className="w-full text-sm"
                    placeholder="Enter your work email"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-white bg-black hover:bg-zinc-800"
                >
                  Submit and Shape the Future!
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Button to Show Video */}
      </div>

      {/* Right Section - Content */}
      <div className="flex flex-col justify-center items-center p-12 bg-white">
        <div className="max-w-xl">
          <h1 className="mb-6 text-4xl leading-[50px] font-bold">
            <span className="text-black">Seamless</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">
              Team Management with
            </span>
            <span className="ml-2 text-black">Teamling</span>
          </h1>

          <p className="mb-8 text-xl leading-relaxed text-zinc-600">
            Transform your team's productivity with automated
            check-ins/check-outs, performance tracking, and Leave Management.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter your work email"
                className="h-12 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
              />
              <Button className="px-8 h-12 text-white whitespace-nowrap bg-black hover:bg-zinc-800">
                Join Waitlist
              </Button>
            </div>
            <p className="text-sm text-zinc-500 shine-effect">
              ✨ Early access coming soon
            </p>
          </div>

          {/* <div className="pt-12 mt-12 border-t border-zinc-100">
            <p className="mb-6 text-sm font-medium text-zinc-400">
              TRUSTED BY TEAMS FROM
            </p>
            <div className="grid grid-cols-4 gap-8 opacity-50">
             
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
