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
import { Search } from "lucide-react";
import { useState } from "react";

interface Course {
	id: string;
	courseCode: string;
	courseName: string;
	answerKey: string;
	dateAdded: Date;
	gradingScale: "STD" | "NUM" | "CUS";
	markPerQuestion: number;
	negativeMarking: boolean;
	numQuestions: number;
	totalMarks: number;
	updatedAt: Date;
}

interface CourseSelectorProps {
	selectedCourse: string;
	onCourseChange: (courseId: string) => void;
	required?: boolean;
	courses: Course[];
}

const CourseSelector = ({
	selectedCourse,
	onCourseChange,
	courses,
	required = true,
}: CourseSelectorProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredCourses = courses.filter(
		(course) =>
			course.courseCode
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Select Course{" "}
					{required && <span className="text-red-500">*</span>}
				</CardTitle>
				<CardDescription>
					Choose the course for which you want to submit student
					answers
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="course-search">Search Courses</Label>
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							id="course-search"
							placeholder="Search by course code or name..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="course-select">Available Courses</Label>
					<Select
						value={selectedCourse}
						onValueChange={onCourseChange}
					>
						<SelectTrigger id="course-select">
							<SelectValue placeholder="Select a course..." />
						</SelectTrigger>
						<SelectContent>
							{filteredCourses.map((course) => (
								<SelectItem key={course.id} value={course.id}>
									<div className="flex flex-col">
										<span className="font-medium">
											{course.courseCode} -{" "}
											{course.courseName}
										</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{selectedCourse && (
					<div className="p-3 bg-muted rounded-lg">
						<span className="text-sm font-medium">
							Selected Course:
						</span>
						<div className="mt-1">
							{(() => {
								const course = courses.find(
									(c) => c.id === selectedCourse
								);
								return course ? (
									<div>
										<span className="font-medium">
											{course.courseCode}
										</span>{" "}
										- {course.courseName}
									</div>
								) : null;
							})()}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default CourseSelector;
