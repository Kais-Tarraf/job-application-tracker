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
import Link from "next/link";

const SignUp = () => {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
			<Card className="w-full max-w-md border-gray-200 shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-black">
						Sign Up
					</CardTitle>
					<CardDescription className="text-gray-600">
						Create an account to start tracking your job applications
					</CardDescription>
				</CardHeader>
				<form className="space-y-4">
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-gray-700">
								Name
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								required
								className="border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-700">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="JoDoe@example.com"
								required
								className="border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								placeholder="letters & numbers and special characters"
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
						>
							Sign Up
						</Button>
						<p className="text-center text-sm text-gray-600">
							Already have an account?
						</p>{" "}
						<Link
							href="/sign-in"
							className="font-medium text-primary hover:underline"
						>
							Sign in
						</Link>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default SignUp;
