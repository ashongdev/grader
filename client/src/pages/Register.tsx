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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, School, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		institution: "",
		role: "",
		password: "",
		confirmPassword: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:8000/api/user/register",
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
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md animate-fade-in">
				<Card className="shadow-lg">
					<CardHeader className="text-center space-y-2">
						<CardTitle className="text-2xl font-bold text-foreground">
							Create Account
						</CardTitle>
						<CardDescription>
							Join OCR MCQ Grader to get started
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="fullName"
									className="text-sm font-medium"
								>
									Full Name
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="fullName"
										name="fullName"
										type="text"
										placeholder="Enter your full name"
										value={formData.fullName}
										onChange={handleInputChange}
										className="pl-10"
										required
									/>
								</div>
							</div>

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
									htmlFor="institution"
									className="text-sm font-medium"
								>
									Institution
								</Label>
								<div className="relative">
									<School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="institution"
										name="institution"
										type="text"
										placeholder="Enter your institution name"
										value={formData.institution}
										onChange={handleInputChange}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="role"
									className="text-sm font-medium"
								>
									Role
								</Label>
								<Select
									onValueChange={(value) =>
										handleSelectChange("role", value)
									}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select your role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="instructor">
											Instructor
										</SelectItem>
										<SelectItem value="teacher">
											Teacher
										</SelectItem>
										<SelectItem value="professor">
											Professor
										</SelectItem>
										<SelectItem value="administrator">
											Administrator
										</SelectItem>
										<SelectItem value="other">
											Other
										</SelectItem>
									</SelectContent>
								</Select>
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
										placeholder="Create a password"
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
								<p className="text-xs text-muted-foreground">
									Password must be at least 8 characters long
								</p>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="confirmPassword"
									className="text-sm font-medium"
								>
									Confirm Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										placeholder="Confirm your password"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										className="pl-10 pr-10"
										required
									/>
									<button
										type="button"
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword
											)
										}
										className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							<div className="flex items-start space-x-2">
								<input
									id="terms"
									type="checkbox"
									className="rounded border-input mt-1"
									required
								/>
								<Label
									htmlFor="terms"
									className="text-sm text-muted-foreground cursor-pointer leading-5"
								>
									I agree to the{" "}
									<Link
										to="/terms"
										className="text-primary hover:text-primary/80"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										to="/privacy"
										className="text-primary hover:text-primary/80"
									>
										Privacy Policy
									</Link>
								</Label>
							</div>

							<Button
								type="submit"
								className="w-full hover-scale"
							>
								Create Account
							</Button>
						</form>

						<Separator />

						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									to="/login"
									className="text-primary hover:text-primary/80 font-medium transition-colors"
								>
									Sign in here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Register;
