"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SignInFormValues, signInSchema } from "../Validation/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginUser } from "../actions/LoginUser";

export default function SignIn() {
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignInFormValues) => {
    const response = await loginUser({
      email: data.email,
      password: data.password,
    });

    if (response?.error) {
      form.setError("root", {
        type: "manual",
        message: response.message || "An error occurred during sign in.",
      });
    } else {
      router.push("/");
    }
  };

  return (
    <Card className="max-w-xl sm:p-10 ">
      <CardHeader className="py-5 pb-10">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back to StaySync
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to access your motel management dashboard and stay connected
          with your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset
              disabled={form.formState.isSubmitting}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            {form.formState.errors.root && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button type="submit" className="w-full mt-4">
              Log In
            </Button>

            <div className="text-sm mt-4">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline "
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
