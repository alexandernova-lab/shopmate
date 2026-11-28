import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Try, Visibility, VisibilityOff } from "@mui/icons-material";
import { registerSchema } from "../schemas/authSchema";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../api/authApi.js";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error
  const [serverError, setServerError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmiting(true);
    try {
      const result = await registerUser(data);
      console.log("Registered:", result);

      // Navigate to login page after successful registration
      navigate("/login");
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
      <div className="w-full max-w-110 bg-surface border border-border rounded-base p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Create your account</h2>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">
            Join ShopMate to shop the latest iPhone, MacBook, iPad and more.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full name
            </label>
            <input
              type="text"
              placeholder="Jane Appleseed"
              {...register("fullName")}
              className={`w-full bg-bg border rounded-base px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-accent ${
                errors.fullName ? "border-danger" : "border-border"
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-danger mt-1.5">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`w-full bg-bg border rounded-base px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-accent ${
                errors.email ? "border-danger" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-danger mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Username</label>
            <input
              type="text"
              placeholder="janeappleseed"
              {...register("username")}
              className={`w-full bg-bg border rounded-base px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-accent ${
                errors.username ? "border-danger" : "border-border"
              }`}
            />
            {errors.username && (
              <p className="text-xs text-danger mt-1.5">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                {...register("password")}
                className={`w-full bg-bg border rounded-base pl-3.5 pr-10 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-accent ${
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
            <p
              className={`text-xs mt-1.5 ${errors.password ? "text-danger" : "text-muted"}`}
            >
              {errors.password
                ? errors.password.message
                : "Use at least 8 characters."}
            </p>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                {...register("confirmPassword")}
                className={`w-full bg-bg border rounded-base pl-3.5 pr-10 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-accent ${
                  errors.confirmPassword ? "border-danger" : "border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-danger mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-on-accent font-medium text-sm py-2.5 rounded-base transition-colors mt-2 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted mt-6">
          Already have an account?{" "}
          <Link to={"/login"} className="text-link hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
