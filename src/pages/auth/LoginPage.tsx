import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthWrapper } from "@/components/AuthWrapper";
import { LoginForm } from "../../components/LoginForm";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  const { data: user } = useAuth();

  useEffect(() => {
    // navigate to saves when user is logged in
    if (user) {
      navigate("/saves");
    }
  }, [user]);

  return (
    <AuthWrapper>
      <LoginForm />
      {/* <LoginForm /> */}
      <br />
      {/* temp commented it out till credentials login is supported */}
      {/* <span className="text-sm font-medium text-gray-900 dark:text-gray-900">
        Don't have an account yet?{" "}
        <Link to="/signup" className="underline">
          go to signup
        </Link>
        .
      </span>
      <br />
      <span className="text-sm font-medium text-gray-900">
        Forgot your password?{" "}
        <Link to="/request-password-reset" className="underline">
          reset it
        </Link>
        .
      </span> */}
    </AuthWrapper>
  );
}
