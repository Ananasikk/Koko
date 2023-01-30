import { createContext } from "react";

export interface User {
  name: string
  email: string
  phone: string
}

export interface IUserContext {
  user: User | null
  setUser: (user: User | null) => void;

  isLogged: boolean;
}

export const UserContext = createContext<
  IUserContext | undefined
>(undefined)