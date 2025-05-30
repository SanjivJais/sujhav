"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useRegister } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const registerMutate = useRegister();
    const router = useRouter();

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        if (!username || !email || !password) {
            toast.error("Please enter required details!")
            return;
        }

        try {
            await registerMutate.mutateAsync({ username, email, password })
            router.push('/auth/login')
        }
        catch (error) {
            let errorMessage = "Something went wrong!"; // Default error message
            // Check if error is an instance of AxiosError
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || "Something went wrong!";
            } else if (error instanceof Error) {
                errorMessage = error.message; // Handle generic JavaScript errors
            }
            toast.error(errorMessage);
        }
    }



    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleFormSubmit} className="p-6 md:p-8 border-r">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Signup</h1>
                                <p className="text-balance text-muted-foreground">
                                    Create your Sujhav account
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="johndoe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    name="password"
                                    id="password"
                                    type="password"
                                    required
                                />
                            </div>
                            <Button disabled={registerMutate.isPending} type="submit" className="w-full">
                                {registerMutate.isPending? "Signing up...": "Signup"}
                            </Button>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="">
                                <Button disabled variant="outline" className="w-full flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span>Login with Google</span>
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="underline underline-offset-4">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="/solution_bg.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] "
                            fill
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
