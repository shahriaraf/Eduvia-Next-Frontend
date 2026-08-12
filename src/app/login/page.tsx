"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { EduviaMark } from "@/components/icons/eduvia-mark";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { loginFormSchema, type LoginFormValues } from "@/features/auth/authSchema";
import { useLoginMutation } from "@/features/auth/authApi";
import { getApiErrorMessage } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials({ token: result.accessToken, user: result.user }));
      router.replace("/students");
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Couldn't sign in. Please try again."));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <EduviaMark className="h-5 w-5" />
          </span>
          <CardTitle>Sign in to Eduvia</CardTitle>
          <CardDescription>Enter your admin credentials to manage students.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <FormField id="email" label="Email" required error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </FormField>

            <FormField id="password" label="Password" required error={errors.password?.message}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="pr-9"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </FormField>

            {formError && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="mt-1" isLoading={isLoading}>
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}