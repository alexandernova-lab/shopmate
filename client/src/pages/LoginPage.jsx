import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginSchema } from "../schemas/authSchema";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../api/authApi.js";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Error
  const [serverError, setServerError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  // Static placeholder submit handler (no API calls yet)
  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);
      console.log("Login success:", result);

      // Navigate to login page after successful registration
      navigate("/");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-4 py-12">
      {/* Brand Title */}
      <h1 className="text-xl font-semibold tracking-tight mb-6">ShopMate</h1>

      {/* Form Card */}
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-[var(--radius-base)] p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">
            Sign in to continue shopping Apple products.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`w-full bg-bg border rounded-[var(--radius-base)] px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-accent ${
                errors.email ? "border-danger" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-danger mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full bg-bg border rounded-[var(--radius-base)] pl-3.5 pr-10 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-accent ${
                  errors.password ? "border-danger" : "border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-on-accent font-medium text-sm py-2.5 rounded-[var(--radius-base)] transition-colors mt-2 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted mt-6">
          New to ShopMate?{" "}
          <Link
            to={"/register"}
            className="text-link hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
