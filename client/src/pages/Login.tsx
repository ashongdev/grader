import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:8000/api/user/login",
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			// toast({
			// 	title: "Success. Redirecting...",
			// 	description: `Registration Successful`,
			// 	variant: "destructive",
			// });

			localStorage.setItem("user", JSON.stringify(response.data.user));

			setTimeout(() => {
				navigate("/");
			}, 1500);
		} catch (error) {
			toast({
				title: error.response.data.message,
				// description: error.response.data.message,
			});
		}

		// User will implement their own login functionality
		console.log("Login form submitted:", formData);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md animate-fade-in">
				<Card className="shadow-lg">
					<CardHeader className="text-center space-y-2">
						<CardTitle className="text-2xl font-bold text-foreground">
							Welcome Back
						</CardTitle>
						<CardDescription>
							Sign in to your OCR MCQ Grader account
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium"
								>
									Email Address
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="Enter your email"
										value={formData.email}
										onChange={handleInputChange}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-sm font-medium"
								>
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										name="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="Enter your password"
										value={formData.password}
										onChange={handleInputChange}
										className="pl-10 pr-10"
										required
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<input
										id="remember"
										type="checkbox"
										className="rounded border-input"
									/>
									<Label
										htmlFor="remember"
										className="text-sm text-muted-foreground cursor-pointer"
									>
										Remember me
									</Label>
								</div>
								<Link
									to="/forgot-password"
									className="text-sm text-primary hover:text-primary/80 transition-colors"
								>
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								className="w-full hover-scale"
							>
								Sign In
							</Button>
						</form>

						<Separator />

						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								Don't have an account?{" "}
								<Link
									to="/register"
									className="text-primary hover:text-primary/80 font-medium transition-colors"
								>
									Sign up here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Login;
