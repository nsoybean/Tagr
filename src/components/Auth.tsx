import { useState, createContext } from "react";
import { createTheme } from "@stitches/react";
// import { styled } from "../../stitches.config";

import {
  type State,
  type CustomizationOptions,
  type ErrorMessage,
} from "@/typings/auth/Auth";
import LoginSignupForm from "./LoginSignupForm";

// import { LoginSignupForm } from "./internal/common/LoginSignupForm";
// import { MessageError, MessageSuccess } from "./internal/Message";

// const logoStyle = {
//   height: "3rem",
// };

// const Container = styled("div", {
//   display: "flex",
//   flexDirection: "column",
// });

// const HeaderText = styled("h2", {
//   fontSize: "1.875rem",
//   fontWeight: "700",
//   marginTop: "1.5rem",
// });

export const AuthContext = createContext({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {},
  setErrorMessage: (errorMessage: ErrorMessage | null) => {},
  setSuccessMessage: (successMessage: string | null) => {},
});

function Auth({
  state,
  appearance,
  logo,
  socialLayout = "vertical",
}: {
  state: State;
} & CustomizationOptions) {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO(matija): this is called on every render, is it a problem?
  // If we do it in useEffect(), then there is a glitch between the default color and the
  // user provided one.
  // const customTheme = createTheme(appearance ?? {});

  const titles: Record<State, string> = {
    login: "Log in",
    signup: "Create a new account",
  };
  const title = titles[state];

  const socialButtonsDirection =
    socialLayout === "vertical" ? "vertical" : "horizontal";

  return (
    <div className="flex flex-col items-center">
      <div>
        {logo && <img height={"3rem"} src={logo} alt="Your Company" />}
        <div className="my-2 text-4xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </div>
      </div>

      {errorMessage && (
        <p className="text-md mt-2 leading-8 text-red-600">
          {errorMessage.title}
          {errorMessage.description && ": "}
          {errorMessage.description}
        </p>
      )}
      {successMessage && (
        <p className="text-md mt-2 leading-8">{successMessage}</p>
      )}
      <AuthContext.Provider
        value={{ isLoading, setIsLoading, setErrorMessage, setSuccessMessage }}
      >
        {(state === "login" || state === "signup") && (
          <LoginSignupForm />
          // state={state}
          // socialButtonsDirection={socialButtonsDirection}
          // additionalSignupFields={additionalSignupFields}
        )}
      </AuthContext.Provider>
    </div>
  );
}

export default Auth;
