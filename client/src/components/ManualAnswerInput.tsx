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
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

interface StudentAnswer {
	id: string;
	studentId: string;
	studentName: string;
	answers: string;
}

interface ManualAnswerInputProps {
	selectedCourse: string;
}

const ManualAnswerInput = ({ selectedCourse }: ManualAnswerInputProps) => {
	const [students, setStudents] = useState<StudentAnswer[]>([]);
	const [newStudent, setNewStudent] = useState({
		studentId: "",
		studentName: "",
		answers: "",
	});
	const { toast } = useToast();

	const addStudent = () => {
		if (!selectedCourse) {
			toast({
				title: "Course Required",
				description:
					"Please select a course before adding student answers.",
				variant: "destructive",
			});
			return;
		}

		if (
			!newStudent.studentId ||
			!newStudent.studentName ||
			!newStudent.answers
		) {
			toast({
				title: "Missing Information",
				description:
					"Please fill in all fields before adding a student.",
				variant: "destructive",
			});
			return;
		}

		const student: StudentAnswer = {
			id: Date.now().toString(),
			...newStudent,
		};

		setStudents((prev) => [...prev, student]);
		setNewStudent({ studentId: "", studentName: "", answers: "" });

		toast({
			title: "Student Added",
			description: `${newStudent.studentName} has been added successfully.`,
		});
	};

	const removeStudent = (id: string) => {
		setStudents((prev) => prev.filter((s) => s.id !== id));
	};

	const updateStudent = (
		id: string,
		field: keyof Omit<StudentAnswer, "id">,
		value: string
	) => {
		setStudents((prev) =>
			prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
		);
	};

	const saveAllAnswers = () => {
		if (!selectedCourse) {
			toast({
				title: "Course Required",
				description: "Please select a course before saving answers.",
				variant: "destructive",
			});
			return;
		}

		if (students.length === 0) {
			toast({
				title: "No Students",
				description: "Please add at least one student before saving.",
				variant: "destructive",
			});
			return;
		}

		// Here you would typically send the data to your backend with course ID
		console.log(
			"Saving student answers for course:",
			selectedCourse,
			students
		);

		toast({
			title: "Answers Saved",
			description: `${students.length} student answer(s) have been saved successfully.`,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Manual Answer Input</CardTitle>
				<CardDescription>
					Enter student answers manually. Use format like "A,B,C,D" or
					"1,2,3,4" for multiple choice answers.
					{!selectedCourse && (
						<span className="block mt-2 text-destructive font-medium">
							Please select a course first to add student answers.
						</span>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Add New Student Form */}
				<div
					className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg ${
						!selectedCourse ? "opacity-50 pointer-events-none" : ""
					}`}
				>
					<div>
						<Label htmlFor="studentId">Student ID</Label>
						<Input
							id="studentId"
							value={newStudent.studentId}
							onChange={(e) =>
								setNewStudent((prev) => ({
									...prev,
									studentId: e.target.value,
								}))
							}
							placeholder="Enter student ID"
						/>
					</div>
					<div>
						<Label htmlFor="studentName">Student Name</Label>
						<Input
							id="studentName"
							value={newStudent.studentName}
							onChange={(e) =>
								setNewStudent((prev) => ({
									...prev,
									studentName: e.target.value,
								}))
							}
							placeholder="Enter student name"
						/>
					</div>
					<div>
						<Label htmlFor="answers">Answers</Label>
						<Input
							id="answers"
							value={newStudent.answers}
							onChange={(e) =>
								setNewStudent((prev) => ({
									...prev,
									answers: e.target.value,
								}))
							}
							placeholder="A,B,C,D or 1,2,3,4"
						/>
					</div>
					<div className="md:col-span-3">
						<Button
							onClick={addStudent}
							className="w-full"
							disabled={!selectedCourse}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Student
						</Button>
					</div>
				</div>

				{/* Student List */}
				{students.length > 0 && (
					<div className="space-y-4">
						<h3 className="font-semibold text-lg">
							Student Answers ({students.length})
						</h3>
						{students.map((student) => (
							<div
								key={student.id}
								className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
							>
								<div>
									<Label>Student ID</Label>
									<Input
										value={student.studentId}
										onChange={(e) =>
											updateStudent(
												student.id,
												"studentId",
												e.target.value
											)
										}
									/>
								</div>
								<div>
									<Label>Student Name</Label>
									<Input
										value={student.studentName}
										onChange={(e) =>
											updateStudent(
												student.id,
												"studentName",
												e.target.value
											)
										}
									/>
								</div>
								<div>
									<Label>Answers</Label>
									<Input
										value={student.answers}
										onChange={(e) =>
											updateStudent(
												student.id,
												"answers",
												e.target.value
											)
										}
									/>
								</div>
								<div className="flex items-end">
									<Button
										variant="destructive"
										size="sm"
										onClick={() =>
											removeStudent(student.id)
										}
										className="w-full"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Remove
									</Button>
								</div>
							</div>
						))}

						<Button
							onClick={saveAllAnswers}
							className="w-full"
							size="lg"
						>
							<Save className="h-4 w-4 mr-2" />
							Save All Answers
						</Button>
					</div>
				)}

				{/* Instructions */}
				<div className="bg-muted p-4 rounded-lg">
					<h4 className="font-medium mb-2">Instructions:</h4>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>
							• Enter answers separated by commas (e.g., A,B,C,D)
						</li>
						<li>• Use consistent format for all students</li>
						<li>• Student ID should be unique for each student</li>
						<li>• You can edit any field after adding a student</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
};

export default ManualAnswerInput;
