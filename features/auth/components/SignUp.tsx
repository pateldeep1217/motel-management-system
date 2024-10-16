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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SignupFormValues, signUpSchema } from "../Validation/signUpSchema";
import { registerUser } from "../actions/RegstierUser";

export default function SignUp() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: SignupFormValues) => {
    const response = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (response?.error) {
      form.setError("email", {
        message: response?.message,
      });
    }
  };

  return (
    <div>
      {form.formState.isSubmitSuccessful ? (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Account Created!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Your account has been successfully created. You can now log in and
              start managing your motels.
            </CardDescription>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link href="/sign-in">Log In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-xl p-10 ">
          <CardHeader className="py-5 pb-10">
            <CardTitle className="text-2xl font-bold text-center">
              Join StaySync
            </CardTitle>
            <CardDescription className="text-center">
              Sign up to manage your motels efficiently and stay connected with
              your team.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                <Button type="submit" className="w-full mt-5">
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col  ">
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
