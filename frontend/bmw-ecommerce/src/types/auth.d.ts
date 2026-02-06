export interface IUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface IAuthContext {
  user: IUser | null;
  authLoading: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
