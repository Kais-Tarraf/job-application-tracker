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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();

		setError("");
		setLoading(true);
		try {
			const result = await signIn.email({
				email,
				password,
			});
			if (result.error) {
				setError(result.error.message ?? "Failed to sign in");
			} else {
				router.push("/dashboard");
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error("Failed to create account", err);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
			<Card className="w-full max-w-md border-gray-200 shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-black">
						Sign In
					</CardTitle>
					<CardDescription className="text-gray-600">
						Log in to your account
					</CardDescription>
				</CardHeader>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
								{error}
							</div>
						)}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-700">
								Email
							</Label>
							<Input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								id="email"
								type="email"
								placeholder="name@example.com"
								required
								className="border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700">
								Password
							</Label>
							<Input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								id="password"
								type="password"
								placeholder="Strong Password"
								required
								minLength={8}
								className="border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90"
							disabled={loading}
						>
							{loading ? "Logging In..." : "Log In"}
						</Button>
						<p className="text-center text-sm text-gray-600">
							Don&apos;t have an account?
							<Link
								className="font-medium text-primary hover:underline"
								href="/sign-up"
							>
								{" "}
								sign up
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default SignIn;
