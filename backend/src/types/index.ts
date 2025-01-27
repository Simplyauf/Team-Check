export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    workspaceId?: string;
  };
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  roleId: string;
}
