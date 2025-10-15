import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useState } from "react"
import AlertDialog from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { Spinner } from "./ui/spinner"

export function LoginForm({
  className,
  ...props
}) {

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    let user = {};
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}user/login`, {
        body: JSON.stringify({ email: data.email, password: data.password }),
        headers: { "Content-Type": "application/json" },
        method: 'POST',
        credentials: "include",
      });

      user = await response.json();
    } catch (error) {
      user.message = error.message || 'Some error has occured'
    }

    if (!user.success) {
      setIsLoading(false)
      return setError({ title: 'Error', desc: user.message || 'Some error has occured try again letter' })
    }

    localStorage.setItem('access-token', user.tokens.accessToken);
    localStorage.setItem('refresh-token', user.tokens.refreshToken);
    navigate('/dashboard')
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your DineFlow Inc account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" {...register('email')} type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" {...register('password')} type="password" required />
              </Field>
              <Field>
                {
                  isLoading ?
                    <Button variant={'outline'}><Spinner size={8} /></Button> :
                    <Button type="submit">Login</Button>
                }
              </Field>
              {error && <AlertDialog variant="destructive" title={error.title} desc={error.desc} />}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  <span className={'grayscale invert-100 brightness-0'}>🔒</span>
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" type="button">
                  <span className={'grayscale invert-100 brightness-0'}>🔒</span>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button">
                  <span className={'grayscale invert-100 brightness-0'}>🔒</span>
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/register">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1512061942530-e6a4e9a5cf27?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169"
              alt="Image"
              className="absolute h-full w-full object-cover" />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
