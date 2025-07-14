import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	BarChart3,
	CheckCircle,
	Clock,
	Target,
	Upload,
	Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
	const features = [
		{
			icon: Zap,
			title: "Lightning Fast",
			description:
				"Grade hundreds of answer sheets in seconds with advanced OCR technology",
		},
		{
			icon: Target,
			title: "High Accuracy",
			description:
				"AI-powered recognition ensures precise reading of handwritten and marked answers",
		},
		{
			icon: Clock,
			title: "Save Time",
			description:
				"Eliminate manual checking and focus on teaching, not grading",
		},
		{
			icon: BarChart3,
			title: "Detailed Analytics",
			description:
				"Get comprehensive reports and insights on student performance",
		},
	];

	const steps = [
		{
			number: 1,
			title: "Upload Answer Key",
			description: "Set up your answer key and grading preferences",
		},
		{
			number: 2,
			title: "Scan Answer Sheets",
			description: "Upload photos or scans of completed answer sheets",
		},
		{
			number: 3,
			title: "Get Results",
			description: "View grades, export reports, and analyze performance",
		},
	];

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="border-b bg-card px-6 py-4">
				<div className="flex items-center gap-4">
					<SidebarTrigger />
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							Dashboard
						</h1>
						<p className="text-muted-foreground">
							Welcome to OCR MCQ Grader
						</p>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 p-6 space-y-8">
				{/* Hero Section */}
				<div className="text-center space-y-4">
					<h2 className="text-4xl font-bold text-foreground">
						Automated MCQ Grading Made Simple
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Transform your grading workflow with AI-powered OCR
						technology. Upload answer sheets, get instant results,
						and save hours of manual work.
					</p>
					<div className="flex gap-4 justify-center pt-4">
						<Button asChild size="lg">
							<Link to="/upload">
								<Upload className="mr-2 h-5 w-5" />
								Start Grading
							</Link>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<Link to="/set-answer-key">Setup Answer Key</Link>
						</Button>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<Card key={index} className="text-center">
							<CardHeader>
								<feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
								<CardTitle className="text-lg">
									{feature.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>

				{/* How It Works */}
				<div className="space-y-6">
					<h3 className="text-3xl font-bold text-center text-foreground">
						How It Works
					</h3>
					<div className="grid md:grid-cols-3 gap-8">
						{steps.map((step, index) => (
							<div key={index} className="text-center space-y-4">
								<div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
									{step.number}
								</div>
								<h4 className="text-xl font-semibold text-foreground">
									{step.title}
								</h4>
								<p className="text-muted-foreground">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Quick Stats */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-accent" />
							Quick Stats
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
							<div>
								<div className="text-2xl font-bold text-primary">
									0
								</div>
								<div className="text-sm text-muted-foreground">
									Sheets Graded
								</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-primary">
									0
								</div>
								<div className="text-sm text-muted-foreground">
									Time Saved (min)
								</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-primary">
									95%
								</div>
								<div className="text-sm text-muted-foreground">
									Accuracy Rate
								</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-primary">
									0
								</div>
								<div className="text-sm text-muted-foreground">
									Reports Generated
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
