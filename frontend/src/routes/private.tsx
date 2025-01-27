import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import SettingsLayout from "@/pages/settings/layout";
import WorkspaceGeneralSettings from "@/pages/settings/workspace/general";
import WorkspaceMembersSettings from "@/pages/settings/workspace/members";
import WorkspaceSecuritySettings from "@/pages/settings/workspace/security";
import WorkspaceIntegrationsSettings from "@/pages/settings/workspace/integrations";
import TeamsSettings from "@/pages/settings/workspace/teams";
import WorkspacePermissionsSettings from "@/pages/settings/workspace/permissions";
import EmployeesView from "@/pages/Employees.jsx";
import LeaveView from "@/pages/leave";
import LeaveDetails from "@/pages/leave/[id]";
import LeaveTypes from "@/pages/leave/types";
import Members from "@/pages/members";
import MemberDetails from "@/pages/members/[id]";
import Teams from "@/pages/teams";
import TeamDetails from "@/pages/teams/[id]";
import Projects from "@/pages/projects";
import ProjectDetails from "@/pages/projects/[id]";
import PerformanceEvaluations from "@/pages/Performance";
import PerformanceProfile from "@/pages/Performance/user/[id]";
import PerformanceSettings from "@/pages/Performance/settings";
import { UsersList } from "@/components/performance/UsersList";
import EvaluationDetail from "@/pages/Performance/Evaluation/[id]";

export const privateRoutes = [
  {
    path: "/dashboard",
    element: (
      <Sidebar>
        <Dashboard />
      </Sidebar>
    ),
  },
  {
    path: "/employees",
    element: (
      <Sidebar>
        <EmployeesView />
      </Sidebar>
    ),
  },
  {
    path: "/leave",
    element: (
      <Sidebar>
        <LeaveView />
      </Sidebar>
    ),
  },
  {
    path: "/leave/types",
    element: (
      <Sidebar>
        <LeaveTypes />
      </Sidebar>
    ),
  },
  {
    path: "/leave/:id",
    element: (
      <Sidebar>
        <LeaveDetails />
      </Sidebar>
    ),
  },
  {
    path: "/members",
    element: (
      <Sidebar>
        <Members />
      </Sidebar>
    ),
  },
  {
    path: "/members/:id",
    element: (
      <Sidebar>
        <MemberDetails />
      </Sidebar>
    ),
  },
  {
    path: "/teams",
    element: (
      <Sidebar>
        <Teams />
      </Sidebar>
    ),
  },
  {
    path: "/teams/:id",
    element: (
      <Sidebar>
        <TeamDetails />
      </Sidebar>
    ),
  },
  {
    path: "/performance",
    element: (
      <Sidebar>
        <PerformanceEvaluations />
      </Sidebar>
    ),
  },
  {
    path: "/performance/:id",
    element: (
      <Sidebar>
        <PerformanceProfile />
      </Sidebar>
    ),
  },
  {
    path: "/performance/settings",
    element: (
      <Sidebar>
        <PerformanceSettings />
      </Sidebar>
    ),
  },
  {
    path: "/performance/users/:id",
    element: (
      <Sidebar>
        <PerformanceProfile />
      </Sidebar>
    ),
  },
  {
    path: "/performance/evaluation/:id",
    element: (
      <Sidebar>
        <EvaluationDetail />
      </Sidebar>
    ),
  },
  {
    path: "/projects",
    element: (
      <Sidebar>
        <Projects />
      </Sidebar>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <Sidebar>
        <ProjectDetails />
      </Sidebar>
    ),
  },

  {
    path: "/settings/general",
    element: (
      <Sidebar>
        <SettingsLayout>
          <WorkspaceGeneralSettings />
        </SettingsLayout>
      </Sidebar>
    ),
  },

  {
    path: "/settings/members",
    element: (
      <Sidebar>
        <SettingsLayout>
          <WorkspaceMembersSettings />
        </SettingsLayout>
      </Sidebar>
    ),
  },
  {
    path: "/settings/security",
    element: (
      <Sidebar>
        <SettingsLayout>
          <WorkspaceSecuritySettings />
        </SettingsLayout>
      </Sidebar>
    ),
  },
  {
    path: "/settings/integrations",
    element: (
      <Sidebar>
        <SettingsLayout>
          <WorkspaceIntegrationsSettings />
        </SettingsLayout>
      </Sidebar>
    ),
  },
  {
    path: "/settings/teams",
    element: (
      <Sidebar>
        <SettingsLayout>
          <TeamsSettings />
        </SettingsLayout>
      </Sidebar>
    ),
  },
  {
    path: "/settings/permissions",
    element: (
      <Sidebar>
        <SettingsLayout>
          <WorkspacePermissionsSettings />
        </SettingsLayout>
      </Sidebar>
    ),
  },
  {
    path: "/settings/billing",
    element: (
      <Sidebar>
        <SettingsLayout>
          <h3>Billing</h3>
        </SettingsLayout>
      </Sidebar>
    ),
  },
];
