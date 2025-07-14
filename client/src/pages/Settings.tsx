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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, BookOpen, Eye, Save, Shield, User } from "lucide-react";
import { useState } from "react";

const Settings = () => {
	const { toast } = useToast();

	// Profile settings
	const [firstName, setFirstName] = useState("John");
	const [lastName, setLastName] = useState("Doe");
	const [email, setEmail] = useState("john.doe@university.edu");
	const [institution, setInstitution] = useState("Sample University");

	// Appearance settings
	const [theme, setTheme] = useState("system");
	const [fontSize, setFontSize] = useState("medium");
	const [language, setLanguage] = useState("en");

	// Grading preferences
	const [defaultGradingStyle, setDefaultGradingStyle] = useState("standard");
	const [defaultPage, setDefaultPage] = useState("dashboard");
	const [autoSaveAnswers, setAutoSaveAnswers] = useState(true);

	// Notification settings
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [gradeNotifications, setGradeNotifications] = useState(true);
	const [reminderNotifications, setReminderNotifications] = useState(false);

	// Privacy settings
	const [profileVisibility, setProfileVisibility] = useState("private");
	const [dataSharing, setDataSharing] = useState(false);

	const handleSave = () => {
		toast({
			title: "Settings Saved",
			description: "Your preferences have been updated successfully.",
		});
	};

	return (
		<div className="flex flex-col min-h-screen">
			<header className="border-b bg-card px-6 py-4">
				<div className="flex items-center gap-4">
					<SidebarTrigger />
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							Settings
						</h1>
						<p className="text-muted-foreground">
							Manage your account and customize your experience
						</p>
					</div>
				</div>
			</header>

			<div className="flex-1 p-6 space-y-6">
				{/* Profile Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Profile Information
						</CardTitle>
						<CardDescription>
							Update your personal details and contact information
						</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="institution">Institution</Label>
							<Input
								id="institution"
								value={institution}
								onChange={(e) => setInstitution(e.target.value)}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Appearance Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Eye className="h-5 w-5" />
							Appearance & Display
						</CardTitle>
						<CardDescription>
							Customize the look and feel of your interface
						</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label>Theme</Label>
							<Select value={theme} onValueChange={setTheme}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
									<SelectItem value="system">
										System
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Font Size</Label>
							<Select
								value={fontSize}
								onValueChange={setFontSize}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="small">Small</SelectItem>
									<SelectItem value="medium">
										Medium
									</SelectItem>
									<SelectItem value="large">Large</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Language</Label>
							<Select
								value={language}
								onValueChange={setLanguage}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="es">Spanish</SelectItem>
									<SelectItem value="fr">French</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Grading Preferences */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="h-5 w-5" />
							Grading & Academic Preferences
						</CardTitle>
						<CardDescription>
							Configure your grading and workflow preferences
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Default Grading Style</Label>
								<Select
									value={defaultGradingStyle}
									onValueChange={setDefaultGradingStyle}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="standard">
											A–F (Letter Grades)
										</SelectItem>
										<SelectItem value="numeric">
											0–100 (Percentage)
										</SelectItem>
										<SelectItem value="points">
											Points-based
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Default Landing Page</Label>
								<Select
									value={defaultPage}
									onValueChange={setDefaultPage}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="dashboard">
											Dashboard
										</SelectItem>
										<SelectItem value="upload">
											Upload
										</SelectItem>
										<SelectItem value="results">
											Results
										</SelectItem>
										<SelectItem value="view-answer-keys">
											Answer Keys
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="auto-save"
								checked={autoSaveAnswers}
								onCheckedChange={setAutoSaveAnswers}
							/>
							<Label htmlFor="auto-save">
								Auto-save answer inputs
							</Label>
						</div>
					</CardContent>
				</Card>

				{/* Notification Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bell className="h-5 w-5" />
							Notifications
						</CardTitle>
						<CardDescription>
							Choose what notifications you want to receive
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center space-x-2">
							<Switch
								id="email-notifications"
								checked={emailNotifications}
								onCheckedChange={setEmailNotifications}
							/>
							<Label htmlFor="email-notifications">
								Email notifications
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="grade-notifications"
								checked={gradeNotifications}
								onCheckedChange={setGradeNotifications}
							/>
							<Label htmlFor="grade-notifications">
								Grading completion alerts
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="reminder-notifications"
								checked={reminderNotifications}
								onCheckedChange={setReminderNotifications}
							/>
							<Label htmlFor="reminder-notifications">
								Assignment reminders
							</Label>
						</div>
					</CardContent>
				</Card>

				{/* Privacy & Security */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Privacy & Security
						</CardTitle>
						<CardDescription>
							Control your privacy and data sharing preferences
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Profile Visibility</Label>
							<Select
								value={profileVisibility}
								onValueChange={setProfileVisibility}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">
										Public
									</SelectItem>
									<SelectItem value="institution">
										Institution Only
									</SelectItem>
									<SelectItem value="private">
										Private
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="data-sharing"
								checked={dataSharing}
								onCheckedChange={setDataSharing}
							/>
							<Label htmlFor="data-sharing">
								Allow anonymous usage data collection for
								improving the platform
							</Label>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end pt-4">
					<Button onClick={handleSave} size="lg">
						<Save className="mr-2 h-4 w-4" />
						Save All Settings
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
