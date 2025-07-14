import { Badge } from "@/components/ui/badge";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ArrowLeft,
	CheckCircle,
	Download,
	Eye,
	FileSpreadsheet,
	XCircle,
} from "lucide-react";
import { useState } from "react";
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

interface Course {
	id: string;
	courseCode: string;
	courseName: string;
}

// Mock data - in real app this would come from API
const mockCourses: Course[] = [
	{
		id: "1",
		courseCode: "CS101",
		courseName: "Introduction to Computer Science",
	},
	{ id: "2", courseCode: "MATH201", courseName: "Calculus II" },
	{ id: "3", courseCode: "PHYS301", courseName: "Advanced Physics" },
];

const mockResults: Record<string, StudentResult[]> = {
	"1": [
		{
			id: "1",
			studentName: "Alice Johnson",
			studentId: "ST001",
			score: 18,
			totalQuestions: 20,
			percentage: 90,
			answers: [
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
			],
			correctAnswers: [
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"C",
				"C",
				"D",
			],
			grade: "A",
			timeProcessed: "2024-01-15 10:30 AM",
		},
		{
			id: "2",
			studentName: "Bob Smith",
			studentId: "ST002",
			score: 15,
			totalQuestions: 20,
			percentage: 75,
			answers: [
				"A",
				"B",
				"C",
				"A",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
			],
			correctAnswers: [
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"C",
				"C",
				"D",
			],
			grade: "B",
			timeProcessed: "2024-01-15 10:32 AM",
		},
	],
	"2": [
		{
			id: "3",
			studentName: "Carol Davis",
			studentId: "ST003",
			score: 12,
			totalQuestions: 15,
			percentage: 80,
			answers: [
				"A",
				"A",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
			],
			correctAnswers: [
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
				"D",
				"A",
				"B",
				"C",
			],
			grade: "B",
			timeProcessed: "2024-01-15 10:35 AM",
		},
	],
};

const CourseResults = () => {
	const { courseId } = useParams<{ courseId: string }>();
	const [selectedResult, setSelectedResult] = useState<StudentResult | null>(
		null
	);

	const course = mockCourses.find((c) => c.id === courseId);
	const results = courseId ? mockResults[courseId] || [] : [];

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

	const averageScore =
		results.length > 0
			? results.reduce((sum, result) => sum + result.percentage, 0) /
			  results.length
			: 0;

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
								<Link to="/results">
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
								<Link to="/results">
									<Button variant="ghost" size="sm">
										<ArrowLeft className="h-4 w-4 mr-2" />
										Back to Courses
									</Button>
								</Link>
							</div>
							<h1 className="text-2xl font-bold text-foreground">
								{course.courseCode} Results
							</h1>
							<p className="text-muted-foreground">
								{course.courseName}
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
								{results.length}
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
								{averageScore.toFixed(1)}%
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
								{results.length > 0
									? Math.max(
											...results.map((r) => r.percentage)
									  )
									: 0}
								%
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
								{results.length > 0
									? (
											(results.filter(
												(r) => r.percentage >= 60
											).length /
												results.length) *
											100
									  ).toFixed(0)
									: 0}
								%
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Results Table */}
				<Card>
					<CardHeader>
						<CardTitle>Student Results</CardTitle>
						<CardDescription>
							Results for {course.courseCode} -{" "}
							{course.courseName}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{results.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									No student submissions found for this
									course.
								</p>
								<Link to="/upload">
									<Button>Upload Answer Sheets</Button>
								</Link>
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
									{results.map((result) => (
										<TableRow key={result.id}>
											<TableCell className="font-medium">
												{result.studentName}
											</TableCell>
											<TableCell>
												{result.studentId}
											</TableCell>
											<TableCell>
												{result.score}/
												{result.totalQuestions}
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
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>
										Detailed Results:{" "}
										{selectedResult.studentName}
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
								{selectedResult.answers.map((answer, index) => (
									<div key={index} className="text-center">
										<div className="text-xs text-muted-foreground mb-1">
											Q{index + 1}
										</div>
										<div
											className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
												answer ===
												selectedResult.correctAnswers[
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
											selectedResult.correctAnswers[
												index
											] ? (
												<CheckCircle className="h-3 w-3 text-green-600 mx-auto" />
											) : (
												<XCircle className="h-3 w-3 text-red-600 mx-auto" />
											)}
										</div>
									</div>
								))}
							</div>
							<div className="flex justify-between items-center pt-4 border-t">
								<div className="text-sm text-muted-foreground">
									Correct: {selectedResult.score} | Incorrect:{" "}
									{selectedResult.totalQuestions -
										selectedResult.score}
								</div>
								<Badge
									className={getGradeColor(
										selectedResult.grade
									)}
								>
									Final Grade: {selectedResult.grade} (
									{selectedResult.percentage}%)
								</Badge>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default CourseResults;
