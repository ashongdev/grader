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
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Eye, FileText, Plus, Search, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Course = {
	id: number;
	courseCode: string;
	courseName: string;
	totalSubmissions: number;
	lastActivity: string;
	averageScore: string;
};

type SubmissionsData = {
	totalSubmissions: number;
	totalCourses: number;
	overallAverage: string;
	courseList: Course[];
};

const Submissions = () => {
	const [courses, setCourses] = useState<SubmissionsData | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);

	const filteredCourses =
		courses &&
		courses.courseList &&
		courses.courseList.filter(
			(course) =>
				course?.courseCode
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				course?.courseName
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		);

	const fetchSubmissions = async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				"http://localhost:8000/api/user/courses",
				{
					params: {
						id: JSON.parse(localStorage.getItem("user")),
					},
				}
			);

			if (response.data) {
				setCourses(response.data);
			}
		} catch (error) {
			toast({
				title: "Unexpected Error",
				description: "An unexpected error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSubmissions();
	}, []);

	if (loading) {
		return (
			<div className="flex flex-col min-h-screen justify-center items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="border-b bg-card px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<SidebarTrigger />
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Submissions
							</h1>
							<p className="text-muted-foreground">
								View and manage submissions for all your courses
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
								{courses?.totalCourses || 0}
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
								{courses?.totalSubmissions || 0}
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
								{Number(courses?.overallAverage).toFixed(1) ||
									0}
								%
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
					{filteredCourses && filteredCourses.length === 0 ? (
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
						filteredCourses &&
						filteredCourses.map((course) => (
							<Card
								key={course?.id}
								className="hover:shadow-md transition-shadow cursor-pointer"
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-lg">
												{course?.courseCode}
											</CardTitle>
											<CardDescription className="mt-1">
												{course?.courseName}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span>
													{course?.totalSubmissions}{" "}
													submissions
												</span>
											</div>
											<div className="flex items-center gap-2">
												<TrendingUp className="h-4 w-4 text-muted-foreground" />
												<span>
													{Number(
														course?.averageScore
													).toFixed(1) || 0.0}
													% avg
												</span>
											</div>
										</div>

										<div className="text-xs text-muted-foreground">
											Last activity:{" "}
											{course?.lastActivity}
										</div>

										<div className="flex gap-2">
											<Link
												to={`/submissions/${course?.courseCode.toLowerCase()}`}
												className="flex-1"
											>
												<Button
													variant="outline"
													className="w-full"
													disabled={
														course?.totalSubmissions ===
														0
													}
												>
													<Eye className="mr-2 h-4 w-4" />
													View Submissions
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

export default Submissions;
