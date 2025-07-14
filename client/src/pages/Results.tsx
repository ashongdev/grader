import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Eye, FileText, Plus, Search, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Course {
	id: string;
	courseCode: string;
	courseName: string;
	totalSubmissions: number;
	averageScore: number;
	lastActivity: string;
	status: "active" | "completed" | "draft";
}

// Mock data - in real app this would come from API
const mockCourses: Course[] = [
	{
		id: "1",
		courseCode: "CS101",
		courseName: "Introduction to Computer Science",
		totalSubmissions: 25,
		averageScore: 82.5,
		lastActivity: "2024-01-15",
		status: "active",
	},
	{
		id: "2",
		courseCode: "MATH201",
		courseName: "Calculus II",
		totalSubmissions: 18,
		averageScore: 76.3,
		lastActivity: "2024-01-14",
		status: "active",
	},
	{
		id: "3",
		courseCode: "PHYS301",
		courseName: "Advanced Physics",
		totalSubmissions: 12,
		averageScore: 89.1,
		lastActivity: "2024-01-13",
		status: "completed",
	},
	{
		id: "4",
		courseCode: "ENG102",
		courseName: "English Composition",
		totalSubmissions: 0,
		averageScore: 0,
		lastActivity: "2024-01-10",
		status: "draft",
	},
];

const Results = () => {
	const [courses] = useState<Course[]>(mockCourses);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredCourses = courses.filter(
		(course) =>
			course.courseCode
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			case "draft":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const totalSubmissions = courses.reduce(
		(sum, course) => sum + course.totalSubmissions,
		0
	);
	const activeCourses = courses.filter(
		(course) => course.status === "active"
	).length;
	const overallAverage =
		courses.filter((c) => c.totalSubmissions > 0).length > 0
			? courses
					.filter((c) => c.totalSubmissions > 0)
					.reduce((sum, course) => sum + course.averageScore, 0) /
			  courses.filter((c) => c.totalSubmissions > 0).length
			: 0;

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="border-b bg-card px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<SidebarTrigger />
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Course Results
							</h1>
							<p className="text-muted-foreground">
								View and manage results for all your courses
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Link to="/set-answer-key">
							<Button variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Add Course
							</Button>
						</Link>
						<Link to="/upload">
							<Button>
								<FileText className="mr-2 h-4 w-4" />
								Upload Answers
							</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 p-6 space-y-6">
				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Total Courses
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{courses.length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Active Courses
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{activeCourses}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Total Submissions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalSubmissions}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Overall Average
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{overallAverage.toFixed(1)}%
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Search */}
				<Card>
					<CardHeader>
						<CardTitle>Search Courses</CardTitle>
						<CardDescription>
							Find courses by code or name
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by course code or name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Courses Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredCourses.length === 0 ? (
						<div className="col-span-full">
							<Card>
								<CardContent className="pt-6">
									<div className="text-center">
										<p className="text-muted-foreground mb-4">
											{searchTerm
												? "No courses match your search."
												: "No courses found."}
										</p>
										<Link to="/set-answer-key">
											<Button>
												<Plus className="mr-2 h-4 w-4" />
												Create Your First Course
											</Button>
										</Link>
									</div>
								</CardContent>
							</Card>
						</div>
					) : (
						filteredCourses.map((course) => (
							<Card
								key={course.id}
								className="hover:shadow-md transition-shadow cursor-pointer"
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-lg">
												{course.courseCode}
											</CardTitle>
											<CardDescription className="mt-1">
												{course.courseName}
											</CardDescription>
										</div>
										<Badge
											className={getStatusColor(
												course.status
											)}
										>
											{course.status}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span>
													{course.totalSubmissions}{" "}
													submissions
												</span>
											</div>
											<div className="flex items-center gap-2">
												<TrendingUp className="h-4 w-4 text-muted-foreground" />
												<span>
													{course.averageScore.toFixed(
														1
													)}
													% avg
												</span>
											</div>
										</div>

										<div className="text-xs text-muted-foreground">
											Last activity:{" "}
											{new Date(
												course.lastActivity
											).toLocaleDateString()}
										</div>

										<div className="flex gap-2">
											<Link
												to={`/results/${course.id}`}
												className="flex-1"
											>
												<Button
													variant="outline"
													className="w-full"
													disabled={
														course.totalSubmissions ===
														0
													}
												>
													<Eye className="mr-2 h-4 w-4" />
													View Results
												</Button>
											</Link>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default Results;
