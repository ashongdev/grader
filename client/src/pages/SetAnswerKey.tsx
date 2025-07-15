import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { FileText, Save } from "lucide-react";
import { useForm } from "react-hook-form";

interface AnswerKeyForm {
	courseCode: string;
	courseName: string;
	numQuestions: number;
	answerKey: string;
	negativeMarking: boolean;
	negativePoints: number;
	totalMarks: number;
	gradingScale: string;
	markPerQuestion: number;
}

const SetAnswerKey = () => {
	const { toast } = useToast();

	const form = useForm<AnswerKeyForm>({
		defaultValues: {
			courseCode: "",
			courseName: "",
			numQuestions: 20,
			answerKey: "",
			markPerQuestion: 1,
			negativeMarking: false,
			negativePoints: 0.25,
			totalMarks: 20, // will be dynamically updated
			gradingScale: "STD",
		},
	});

	const watchedAnswerKey = form.watch("answerKey");
	const watchedNumQuestions = form.watch("numQuestions");

	const onSubmit = async (data: AnswerKeyForm) => {
		// Clean and validate answer key
		const cleanAnswerKey = data.answerKey
			.replace(/[^ABCD ]/gi, "")
			.toUpperCase();

		if (cleanAnswerKey.length !== data.numQuestions) {
			toast({
				title: "Validation Error",
				description: `Answer key must contain exactly ${data.numQuestions} answers (A, B, C, or D).`,
				variant: "destructive",
			});
			return;
		}

		// ✅ Calculate total marks
		const calculatedTotalMarks = data.numQuestions * data.markPerQuestion;

		const newData = {
			...data,
			answerKey: cleanAnswerKey,
			totalMarks: calculatedTotalMarks,
			author: JSON.parse(localStorage.getItem("user") || "{}"),
		};

		try {
			const response = await axios.post(
				"http://localhost:8000/api/user/save",
				newData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data) {
				toast({
					title: "Answer Key Saved",
					description: `Answer key for ${data.courseCode} has been saved successfully.`,
				});
				form.reset();
			}
		} catch (error) {
			const message =
				error?.response?.data?.message || "Unexpected error";
			const status = error?.response?.status || "Error";

			console.log("🚀 ~ onSubmit ~ error:", error);

			toast({
				title: `Status: ${status}`,
				description: message,
				variant: "destructive",
			});
		}
	};

	const generateRandomKey = () => {
		const options = ["A", "B", "C", "D"];
		const numQuestions = form.getValues("numQuestions");
		const randomKey = Array.from(
			{ length: numQuestions },
			() => options[Math.floor(Math.random() * options.length)]
		).join("");
		form.setValue("answerKey", randomKey);
	};

	const formatAnswerKey = (value: string) => {
		return value.replace(/[^ABCD ]/gi, "").toUpperCase();
	};

	return (
		<div className="flex flex-col min-h-screen">
			<header className="border-b bg-card px-6 py-4">
				<div className="flex items-center gap-4">
					<SidebarTrigger />
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							Set Answer Key
						</h1>
						<p className="text-muted-foreground">
							Create and configure answer keys for your courses
						</p>
					</div>
				</div>
			</header>

			<div className="flex-1 p-6 space-y-6">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Course Info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Course Information
								</CardTitle>
								<CardDescription>
									Basic details about the course and exam
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="courseCode"
										rules={{
											required: "Course code is required",
										}}
										render={({ field }) => (
											<FormItem>
												<Label>Course Code</Label>
												<FormControl>
													<Input
														placeholder="e.g., CS101"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="courseName"
										rules={{
											required: "Course name is required",
										}}
										render={({ field }) => (
											<FormItem>
												<Label>Course Name</Label>
												<FormControl>
													<Input
														placeholder="e.g., Intro to CS"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Answer Key Configuration */}
						<Card>
							<CardHeader>
								<CardTitle>Answer Key Configuration</CardTitle>
								<CardDescription>
									Set up the correct answers for your multiple
									choice questions
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<FormField
										// control={form.control}
										name="numQuestions"
										rules={{
											required:
												"Number of questions is required",
											min: {
												value: 1,
												message: "Must be at least 1",
											},
											max: {
												value: 200,
												message: "Max 200 questions",
											},
										}}
										render={({ field }) => (
											<FormItem>
												<Label>
													Number of Questions
												</Label>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) =>
															field.onChange(
																parseInt(
																	e.target
																		.value
																) || 0
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="markPerQuestion"
										rules={{
											required:
												"Number of questions is required",
											min: {
												value: 1,
												message: "Must be at least 1",
											},
											max: {
												value: 200,
												message: "Max 200 questions",
											},
										}}
										render={({ field }) => (
											<FormItem>
												<Label>
													Mark Awarded Per Question
												</Label>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) =>
															field.onChange(
																parseInt(
																	e.target
																		.value
																) || 0
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="gradingScale"
										render={({ field }) => (
											<FormItem>
												<Label>Grading Scale</Label>
												<FormControl>
													<Select
														value={field.value}
														onValueChange={
															field.onChange
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="STD">
																Standard (A–F)
															</SelectItem>
															<SelectItem value="NUM">
																Numeric (0–100)
															</SelectItem>
															<SelectItem value="CUS">
																Custom Scale
															</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="answerKey"
									rules={{
										required: "Answer key is required",
										validate: (value) => {
											const cleanKey =
												formatAnswerKey(value);
											if (
												cleanKey.length !==
												watchedNumQuestions
											) {
												return `Answer key must contain exactly ${watchedNumQuestions} answers`;
											}
											return true;
										},
									}}
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center justify-between">
												<Label>Answer Key</Label>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={generateRandomKey}
												>
													Generate Random
												</Button>
											</div>
											<FormControl>
												<Textarea
													className="font-mono max-h-[5rem]"
													placeholder="Enter answers like ABCDABCD..."
													maxLength={
														watchedNumQuestions
													}
													{...field}
													onChange={(e) => {
														const formatted =
															formatAnswerKey(
																e.target.value
															);
														field.onChange(
															formatted
														);
													}}
												/>
											</FormControl>
											<FormDescription>
												Enter answers as a sequence of
												letters (ABCD). Current length:{" "}
												{
													formatAnswerKey(
														watchedAnswerKey
													).length
												}{" "}
												/ {watchedNumQuestions}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Grading Settings */}
						<Card>
							<CardHeader>
								<CardTitle>Grading Settings</CardTitle>
								<CardDescription>
									Configure how the exam will be graded
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="negativeMarking"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<Label className="text-base">
													Negative Marking
												</Label>
												<FormDescription>
													Deduct points for incorrect
													answers
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="negativePoints"
									rules={{
										min: {
											value: 0,
											message: "Cannot be negative",
										},
										max: {
											value: 10,
											message: "Max 10 points",
										},
									}}
									render={({ field }) => (
										<FormItem>
											<Label>
												Points Deducted per Wrong Answer
											</Label>
											<FormControl>
												<Input
													type="number"
													step="0.25"
													{...field}
													disabled={
														!form.watch(
															"negativeMarking"
														)
													}
													onChange={(e) =>
														field.onChange(
															parseFloat(
																e.target.value
															) || 0
														)
													}
												/>
											</FormControl>
											<FormDescription>
												Points to deduct for each
												incorrect answer
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button type="submit" size="lg">
								<Save className="mr-2 h-4 w-4" />
								Save Answer Key
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default SetAnswerKey;
