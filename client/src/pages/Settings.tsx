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
import { Save, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";

const AppSettings = () => {
	const { toast } = useToast();
	const [appName, setAppName] = useState("AutoGrade");
	const [theme, setTheme] = useState("system");
	const [defaultPage, setDefaultPage] = useState("dashboard");
	const [autoProcess, setAutoProcess] = useState(true);
	const [gradingStyle, setGradingStyle] = useState("standard");

	const handleSave = () => {
		toast({
			title: "Settings Saved",
			description: "Your preferences have been updated.",
		});
	};

	return (
		<div className="flex flex-col min-h-screen">
			<header className="border-b bg-card px-6 py-4">
				<div className="flex items-center gap-4">
					<SidebarTrigger />
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							App Settings
						</h1>
						<p className="text-muted-foreground">
							Configure app-wide preferences and behavior
						</p>
					</div>
				</div>
			</header>

			<div className="flex-1 p-6 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<SettingsIcon className="h-5 w-5" />
							General Settings
						</CardTitle>
						<CardDescription>
							Basic details and theme preferences
						</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Application Name</Label>
							<Input
								value={appName}
								onChange={(e) => setAppName(e.target.value)}
							/>
						</div>
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
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>User Preferences</CardTitle>
						<CardDescription>
							Customize user experience
						</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
										Upload Sheets
									</SelectItem>
									<SelectItem value="results">
										Results
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Grading Style</Label>
							<Select
								value={gradingStyle}
								onValueChange={setGradingStyle}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="standard">
										A–F (Standard)
									</SelectItem>
									<SelectItem value="numeric">
										0–100 (Numeric)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Upload Behavior</CardTitle>
						<CardDescription>
							Control how uploads are handled
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2">
							<Switch
								id="auto-process"
								checked={autoProcess}
								onCheckedChange={setAutoProcess}
							/>
							<Label htmlFor="auto-process">
								Auto-process uploads
							</Label>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end pt-4">
					<Button onClick={handleSave} size="lg">
						<Save className="mr-2 h-4 w-4" />
						Save Settings
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AppSettings;
