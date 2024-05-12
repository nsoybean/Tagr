import { createTheme } from "@stitches/react";

export enum AuthStateEnum {
  Login = "login",
  Signup = "signup",
}

export type CustomizationOptions = {
  logo?: string;
  socialLayout?: "horizontal" | "vertical";
  appearance?: Parameters<typeof createTheme>[0];
};

export type ErrorMessage = {
  title: string;
  description?: string;
};

export type FormState = {
  isLoading: boolean;
};
