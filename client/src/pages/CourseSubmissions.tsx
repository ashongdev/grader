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
import Spinner from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
	ArrowLeft,
	CheckCircle,
	Download,
	Eye,
	FileSpreadsheet,
	Search,
	XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface StudentResult {
	id: string;
	studentName: string;
	studentId: string;
	score: number;
	totalQuestions: number;
	percentage: number;
	answers: string[];
	correctAnswers: string[];
	grade: string;
	timeProcessed: string;
}

type Submission = {
	id: number;
	studentId: number;
	studentName: string;
	score: number;
	percentage: number;
	grade: string;
	answers: string[];
	timeProcessed: string;
};

type CourseReport = {
	courseName: string;
	courseCode: string;
	totalSubmissions: number;
	averageScore: string;
	highestScore: number;
	passRate: number;
	numOfQuestions: number;
	correctAnswers: string;
	submissions: Submission[];
};

const CourseSubmissions = () => {
	const { courseCode } = useParams<{ courseCode: string }>();
	const [course, setCourse] = useState<CourseReport>();
	const [selectedResult, setSelectedResult] = useState<Submission | null>(
		null
	);
	const [searchQuery, setSearchQuery] = useState("");
	const detailsRef = useRef<HTMLDivElement | null>(null);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	// Scroll to detailed results when selectedResult changes
	useEffect(() => {
		if (selectedResult && detailsRef.current) {
			detailsRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [selectedResult]);

	// Filter submissions based on search query
	const filteredSubmissions = useMemo(() => {
		if (!course?.submissions) return [];

		if (!searchQuery.trim()) {
			return course.submissions;
		}

		const query = searchQuery.toLowerCase();
		return course.submissions.filter(
			(submission) =>
				submission.studentName.toLowerCase().includes(query) ||
				submission.studentId.toString().includes(query)
		);
	}, [course?.submissions, searchQuery]);

	const fetchCourseSubmissions = async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`http://localhost:8000/api/user/course/${courseCode}`,
				{
					params: {
						id: JSON.parse(localStorage.getItem("user")),
					},
				}
			);

			if (response.data) {
				setCourse(response.data);
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
		fetchCourseSubmissions();
	}, []);

	const getGradeColor = (grade: string) => {
		switch (grade) {
			case "A":
				return "bg-green-100 text-green-800";
			case "B":
				return "bg-blue-100 text-blue-800";
			case "C":
				return "bg-yellow-100 text-yellow-800";
			case "D":
				return "bg-orange-100 text-orange-800";
			case "F":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col min-h-screen justify-center items-center">
				<Spinner />
			</div>
		);
	}

	if (!course) {
		return (
			<div className="flex flex-col min-h-screen">
				<header className="border-b bg-card px-6 py-4">
					<div className="flex items-center gap-4">
						<SidebarTrigger />
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Course Not Found
							</h1>
							<p className="text-muted-foreground">
								The requested course could not be found
							</p>
						</div>
					</div>
				</header>
				<div className="flex-1 p-6">
					<Card>
						<CardContent className="pt-6">
							<div className="text-center">
								<p className="text-muted-foreground mb-4">
									The course you're looking for doesn't exist.
								</p>
								<Link to="/submissions">
									<Button>
										<ArrowLeft className="mr-2 h-4 w-4" />
										Back to Courses
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
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
							<div className="flex items-center gap-2 mb-1">
								<Link to="/submissions">
									<Button variant="ghost" size="sm">
										<ArrowLeft className="h-4 w-4 mr-2" />
										Back to Courses
									</Button>
								</Link>
							</div>
							<h1 className="text-2xl font-bold text-foreground">
								{course?.courseCode} Results
							</h1>
							<p className="text-muted-foreground">
								{course?.courseName}
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Button variant="outline">
							<Download className="mr-2 h-4 w-4" />
							Export PDF
						</Button>
						<Button variant="outline">
							<FileSpreadsheet className="mr-2 h-4 w-4" />
							Export CSV
						</Button>
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
								Total Submissions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{course?.totalSubmissions || 0}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Average Score
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{Number(course?.averageScore).toFixed(1)}%
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Highest Score
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{course?.highestScore || 0}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Pass Rate
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{course?.passRate || 0}%
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Results Table */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Student Results</CardTitle>
								<CardDescription>
									Results for {course?.courseCode} -{" "}
									{course?.courseName}
								</CardDescription>
							</div>
							<div className="flex items-center gap-2 w-full max-w-sm">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search students..."
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
										className="pl-10"
									/>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{course && course?.submissions.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									No student submissions found for this
									course.
								</p>
								<Link to="/upload">
									<Button>Upload Answer Sheets</Button>
								</Link>
							</div>
						) : filteredSubmissions.length === 0 && searchQuery ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									No students found matching "{searchQuery}".
								</p>
								<Button
									variant="outline"
									onClick={() => setSearchQuery("")}
								>
									Clear Search
								</Button>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Student</TableHead>
										<TableHead>ID</TableHead>
										<TableHead>Score</TableHead>
										<TableHead>Percentage</TableHead>
										<TableHead>Grade</TableHead>
										<TableHead>Processed</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredSubmissions.map((result) => (
										<TableRow key={result.id}>
											<TableCell className="font-medium">
												{result.studentName}
											</TableCell>
											<TableCell>
												{result.studentId}
											</TableCell>
											<TableCell>
												{result.score}/
												{course?.numOfQuestions}
											</TableCell>
											<TableCell>
												{result.percentage}%
											</TableCell>
											<TableCell>
												<Badge
													className={getGradeColor(
														result.grade
													)}
												>
													{result.grade}
												</Badge>
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{result.timeProcessed}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														setSelectedResult(
															result
														)
													}
												>
													<Eye className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* Detailed View Modal */}
				{selectedResult && (
					<Card ref={detailsRef}>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>
										Detailed Results:{" "}
										{selectedResult?.studentName}
									</CardTitle>
									<CardDescription>
										Question-by-question analysis
									</CardDescription>
								</div>
								<Button
									variant="outline"
									onClick={() => setSelectedResult(null)}
								>
									Close
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
								{selectedResult &&
									selectedResult?.answers.length !== 0 &&
									selectedResult?.answers.map(
										(answer, index) => (
											<div
												key={index}
												className="text-center"
											>
												<div className="text-xs text-muted-foreground mb-1">
													Q{index + 1}
												</div>
												<div
													className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
														answer ===
														course?.correctAnswers[
															index
														]
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{answer}
												</div>
												<div className="text-xs mt-1">
													{answer ===
													course?.correctAnswers[
														index
													] ? (
														<CheckCircle className="h-3 w-3 text-green-600 mx-auto" />
													) : (
														<XCircle className="h-3 w-3 text-red-600 mx-auto" />
													)}
												</div>
											</div>
										)
									)}
							</div>
							<div className="flex justify-between items-center pt-4 border-t">
								<div className="text-sm text-muted-foreground">
									Correct: {selectedResult?.score} |
									Incorrect:{" "}
									{course?.numOfQuestions -
										selectedResult?.score}
								</div>
								<Badge
									className={getGradeColor(
										selectedResult?.grade
									)}
								>
									Final Grade: {selectedResult?.grade} (
									{selectedResult?.percentage}%)
								</Badge>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default CourseSubmissions;
