import { AuthStateEnum, CustomizationOptions } from "@/typings/auth/types";
import Auth from "./Auth";

export function LoginForm({
  appearance,
  logo,
  socialLayout,
}: CustomizationOptions) {
  return (
    <Auth
      appearance={appearance}
      logo={logo}
      socialLayout={socialLayout}
      state={AuthStateEnum.Login}
    />
  );
}
