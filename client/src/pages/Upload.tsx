import CourseSelector from "@/components/CourseSelector";
import ManualAnswerInput from "@/components/ManualAnswerInput";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
	CheckCircle,
	FileImage,
	KeyboardIcon,
	Upload as UploadIcon,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ... keep existing code (UploadedFile interface)
interface UploadedFile {
	id: string;
	name: string;
	size: number;
	type: string;
	status: "uploading" | "completed" | "error";
	progress: number;
}

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

const Upload = () => {
	const [files, setFiles] = useState<UploadedFile[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState("");
	const [courses, setCourses] = useState<Course[]>([]);
	const { toast } = useToast();

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const processFiles = (fileList: FileList) => {
		const validTypes = ["image/jpeg", "image/png", "application/pdf"];
		const newFiles: UploadedFile[] = [];

		Array.from(fileList).forEach((file) => {
			if (validTypes.includes(file.type)) {
				const uploadFile: UploadedFile = {
					id:
						Date.now().toString() +
						Math.random().toString(36).substr(2, 9),
					name: file.name,
					size: file.size,
					type: file.type,
					status: "uploading",
					progress: 0,
				};
				newFiles.push(uploadFile);
			} else {
				toast({
					title: "Invalid file type",
					description: `${file.name} is not a supported file type. Please use JPEG, PNG, or PDF.`,
					variant: "destructive",
				});
			}
		});

		setFiles((prev) => [...prev, ...newFiles]);

		// Simulate upload progress
		newFiles.forEach((file) => {
			simulateUpload(file.id);
		});
	};

	const simulateUpload = (fileId: string) => {
		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 20;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				setFiles((prev) =>
					prev.map((f) =>
						f.id === fileId
							? { ...f, status: "completed", progress: 100 }
							: f
					)
				);
				toast({
					title: "Upload completed",
					description: "File uploaded and OCR processing initiated.",
				});
			} else {
				setFiles((prev) =>
					prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
				);
			}
		}, 200);
	};

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const files = e.dataTransfer.files;
		processFiles(files);
	}, []);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			processFiles(e.target.files);
		}
	};

	const removeFile = (fileId: string) => {
		setFiles((prev) => prev.filter((f) => f.id !== fileId));
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const fetchAnswerKeys = async () => {
		try {
			const email = JSON.parse(localStorage.getItem("user"));
			const response = await axios.get(
				`http://localhost:8000/api/user/keys/${email}`
			);
			if (response.data) {
				setCourses(response.data);
			}
		} catch (error) {
			const { message } = error.response.data;

			console.log("🚀 ~ onSubmit ~ error:", error);
			if (error.status === 400) {
				toast({
					title: `Status: ${error.status}`,
					description: message,
				});
				return;
			}

			toast({
				title: `Status: ${error.status}`,
				description: `${message}`,
			});
		}
	};
	useEffect(() => {
		fetchAnswerKeys();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="border-b bg-card px-6 py-4">
				<div className="flex items-center gap-4">
					<SidebarTrigger />
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							Upload Answer Sheets
						</h1>
						<p className="text-muted-foreground">
							Upload scanned files or manually input student
							answers
						</p>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 p-6 space-y-6">
				<Tabs defaultValue="upload" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="upload"
							className="flex items-center gap-2"
						>
							<UploadIcon className="h-4 w-4" />
							File Upload
						</TabsTrigger>
						<TabsTrigger
							value="manual"
							className="flex items-center gap-2"
						>
							<KeyboardIcon className="h-4 w-4" />
							Manual Input
						</TabsTrigger>
					</TabsList>
					<TabsContent value="upload" className="space-y-6">
						{/* Upload Area */}
						<Card>
							<CardHeader>
								<CardTitle>Upload Files</CardTitle>
								<CardDescription>
									Drag and drop your answer sheets here, or
									click to browse. Supported formats: JPEG,
									PNG, PDF (max 10MB each)
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div
									className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
										isDragOver
											? "border-primary bg-primary/5"
											: "border-muted-foreground/25 hover:border-primary/50"
									}`}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
								>
									<UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										Drop your files here
									</h3>
									<p className="text-muted-foreground mb-4">
										or
									</p>
									<Button asChild>
										<label
											htmlFor="file-upload"
											className="cursor-pointer"
										>
											Browse Files
											<input
												id="file-upload"
												type="file"
												multiple
												accept="image/jpeg,image/png,application/pdf"
												onChange={handleFileSelect}
												className="hidden"
											/>
										</label>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* File List */}
						{files.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>
										Uploaded Files ({files.length})
									</CardTitle>
									<CardDescription>
										Processing status of your uploaded
										answer sheets
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{files.map((file) => (
											<div
												key={file.id}
												className="flex items-center gap-4 p-4 border rounded-lg"
											>
												<FileImage className="h-8 w-8 text-muted-foreground flex-shrink-0" />
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between mb-1">
														<h4 className="font-medium truncate">
															{file.name}
														</h4>
														<div className="flex items-center gap-2">
															{file.status ===
																"completed" && (
																<CheckCircle className="h-4 w-4 text-accent" />
															)}
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	removeFile(
																		file.id
																	)
																}
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													</div>
													<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
														<span>
															{formatFileSize(
																file.size
															)}
														</span>
														<span className="capitalize">
															{file.status}
														</span>
													</div>
													{file.status ===
														"uploading" && (
														<Progress
															value={
																file.progress
															}
															className="h-2"
														/>
													)}
												</div>
											</div>
										))}
									</div>

									{files.some(
										(f) => f.status === "completed"
									) && (
										<div className="pt-4 border-t">
											<Button className="w-full">
												Process All Completed Files
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Instructions */}
						<Card>
							<CardHeader>
								<CardTitle>Upload Tips</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>
										• Ensure answer sheets are well-lit and
										clearly visible
									</li>
									<li>
										• Multiple choice bubbles should be
										darkly filled
									</li>
									<li>
										• Avoid shadows, creases, or blurry
										images
									</li>
									<li>
										• Each file should contain one complete
										answer sheet
									</li>
									<li>• Maximum file size: 10MB per file</li>
								</ul>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="manual" className="space-y-6">
						<ManualAnswerInput
							selectedCourse={selectedCourse}
							courses={courses}
						/>
					</TabsContent>{" "}
				</Tabs>

				{/* Course Selection */}
				<CourseSelector
					selectedCourse={selectedCourse}
					courses={courses}
					onCourseChange={setSelectedCourse}
				/>
			</div>
		</div>
	);
};

export default Upload;
