import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Spinner from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
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
	Download,
	Edit,
	Eye,
	Plus,
	Save,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface AnswerKey {
	id: string;
	courseCode: string;
	courseName: string;
	dateAdded: string;
	numQuestions: number;
	answerKey: string;
	negativeMarking: boolean;
	totalMarks: number;
	markPerQuestion: number;
}

const ViewAnswerKeys = () => {
	const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedKey, setSelectedKey] = useState<AnswerKey | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<Partial<AnswerKey>>({});
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const filteredKeys = answerKeys.filter(
		(key) =>
			key.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
			key.courseName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = async (id: string) => {
		try {
			const response = await axios.post(
				`http://localhost:8000/api/user/delete`,
				{ id, author: JSON.parse(localStorage.getItem("user")) },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data) {
				setAnswerKeys(answerKeys.filter((key) => key.id !== id));
				toast({
					title: "Answer Key Deleted",
					description:
						"The answer key has been removed successfully.",
				});
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

	const handleExport = (answerKey: AnswerKey) => {
		// In a real app, this would generate and download a file
		const exportData = {
			courseCode: answerKey.courseCode,
			courseName: answerKey.courseName,
			numQuestions: answerKey.numQuestions,
			answerKey: answerKey.answerKey,
			totalMarks: answerKey.totalMarks,
			negativeMarking: answerKey.negativeMarking,
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${answerKey.courseCode}_answer_key.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast({
			title: "Answer Key Exported",
			description: `Answer key for ${answerKey.courseCode} has been downloaded.`,
		});
	};

	const handleEdit = (answerKey: AnswerKey) => {
		setEditingId(answerKey.id);
		setEditForm({ ...answerKey });
	};

	useEffect(() => {
		const calculatedTotalMarks =
			editForm.numQuestions * editForm.markPerQuestion;
		setEditForm((prev) => ({ ...prev, totalMarks: calculatedTotalMarks }));
	}, [editForm.numQuestions, editForm.markPerQuestion]);

	const handleSaveEdit = async () => {
		if (!editingId || !editForm) return;

		// Validate answer key length
		const cleanAnswerKey =
			editForm.answerKey?.replace(/[^ABCD]/gi, "").toUpperCase() || "";
		if (cleanAnswerKey.length !== editForm.numQuestions) {
			toast({
				title: "Validation Error",
				description: `Answer key must contain exactly ${editForm.numQuestions} answers (A, B, C, or D).`,
				variant: "destructive",
			});
			return;
		}

		try {
			const response = await axios.patch(
				`http://localhost:8000/api/user/edit`,
				{
					...editForm,
					author: JSON.parse(localStorage.getItem("user")),
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data) {
				setAnswerKeys(
					answerKeys.map((key) =>
						key.id === editingId
							? { ...key, ...editForm, answerKey: cleanAnswerKey }
							: key
					)
				);

				setEditingId(null);
				setEditForm({});

				toast({
					title: "Answer Key Updated",
					description:
						"The answer key has been updated successfully.",
				});
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

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditForm({});
	};

	const formatAnswerKey = (value: string) => {
		return value.replace(/[^ABCD]/gi, "").toUpperCase();
	};

	const formatAnswerKeyPreview = (key: string) => {
		if (key.length <= 20) return key;
		return key.substring(0, 20) + "...";
	};

	const fetchAnswerKeys = async () => {
		try {
			setLoading(true);
			const email = JSON.parse(localStorage.getItem("user"));
			const response = await axios.get(
				`http://localhost:8000/api/user/keys/${email}`
			);
			if (response.data) {
				setAnswerKeys(response.data);
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
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchAnswerKeys();
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
				<div className="flex items-center gap-4">
					<SidebarTrigger />
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-foreground">
							Answer Keys
						</h1>
						<p className="text-muted-foreground">
							View and manage all your course answer keys
						</p>
					</div>
					<Link to="/set-answer-key">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add New Key
						</Button>
					</Link>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 p-6 space-y-6">
				{/* Search and Filters */}
				<Card>
					<CardHeader>
						<CardTitle>Search Answer Keys</CardTitle>
						<CardDescription>
							Find answer keys by course code or name
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex gap-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search by course code or name..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="pl-10"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Answer Keys Table */}
				<Card>
					<CardHeader>
						<CardTitle>
							Answer Keys ({filteredKeys.length})
						</CardTitle>
						<CardDescription>
							All configured answer keys for your courses
						</CardDescription>
					</CardHeader>
					<CardContent>
						{filteredKeys.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									{searchTerm
										? "No answer keys match your search."
										: "No answer keys found."}
								</p>
								<Link to="/set-answer-key">
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Create Your First Answer Key
									</Button>
								</Link>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Course</TableHead>
										<TableHead>Date Added</TableHead>
										<TableHead>Questions</TableHead>
										<TableHead>Total Marks</TableHead>
										<TableHead>
											Answer Key Preview
										</TableHead>
										<TableHead>Settings</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredKeys.map((answerKey) => (
										<TableRow
											key={answerKey.id}
											className={
												editingId === answerKey.id
													? "bg-muted/30"
													: ""
											}
										>
											<TableCell>
												{editingId === answerKey.id ? (
													<div className="space-y-2">
														<Input
															value={
																editForm.courseCode ||
																""
															}
															onChange={(e) =>
																setEditForm({
																	...editForm,
																	courseCode:
																		e.target
																			.value,
																})
															}
															placeholder="Course Code"
															className="text-sm"
														/>
														<Input
															value={
																editForm.courseName ||
																""
															}
															onChange={(e) =>
																setEditForm({
																	...editForm,
																	courseName:
																		e.target
																			.value,
																})
															}
															placeholder="Course Name"
															className="text-sm"
														/>
													</div>
												) : (
													<div>
														<div className="font-medium">
															{
																answerKey.courseCode
															}
														</div>
														<div className="text-sm text-muted-foreground">
															{
																answerKey.courseName
															}
														</div>
													</div>
												)}
											</TableCell>
											<TableCell>
												{new Date(
													answerKey.dateAdded
												).toLocaleDateString()}
											</TableCell>
											<TableCell>
												{editingId === answerKey.id ? (
													<Input
														type="number"
														value={
															editForm.numQuestions ||
															""
														}
														onChange={(e) =>
															setEditForm({
																...editForm,
																numQuestions:
																	parseInt(
																		e.target
																			.value
																	) || 0,
															})
														}
														className="w-20 text-sm"
														min="1"
														max="200"
													/>
												) : (
													<Badge variant="secondary">
														{answerKey.numQuestions}
													</Badge>
												)}
											</TableCell>
											<TableCell>
												{editingId === answerKey.id ? (
													<Input
														type="number"
														disabled
														value={
															editForm.totalMarks ||
															""
														}
														onChange={(e) =>
															setEditForm({
																...editForm,
																totalMarks:
																	parseInt(
																		e.target
																			.value
																	) || 0,
															})
														}
														className="w-20 text-sm"
														min="1"
													/>
												) : (
													`${answerKey.totalMarks} pts`
												)}
											</TableCell>
											<TableCell>
												{editingId === answerKey.id ? (
													<Input
														value={
															editForm.answerKey ||
															""
														}
														maxLength={
															editForm.numQuestions
														}
														onChange={(e) =>
															setEditForm({
																...editForm,
																answerKey:
																	formatAnswerKey(
																		e.target
																			.value
																	),
															})
														}
														placeholder="ABCDABCD..."
														className="font-mono text-sm"
													/>
												) : (
													<code className="text-sm font-mono bg-muted px-2 py-1 rounded">
														{formatAnswerKeyPreview(
															answerKey.answerKey
														)}
													</code>
												)}
											</TableCell>
											<TableCell>
												{editingId === answerKey.id ? (
													<div className="flex items-center space-x-2">
														<Switch
															checked={
																editForm.negativeMarking ||
																false
															}
															onCheckedChange={(
																checked
															) =>
																setEditForm({
																	...editForm,
																	negativeMarking:
																		checked,
																})
															}
														/>
														<Label className="text-xs">
															Negative Marking
														</Label>
													</div>
												) : answerKey.negativeMarking ? (
													<Badge variant="outline">
														Negative Marking
													</Badge>
												) : (
													<Badge variant="secondary">
														No Penalty
													</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												{editingId === answerKey.id ? (
													<div className="flex gap-2 justify-end">
														<Button
															variant="outline"
															size="sm"
															onClick={
																handleSaveEdit
															}
															className="text-green-600 hover:text-green-700"
														>
															<Save className="h-4 w-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={
																handleCancelEdit
															}
															className="text-red-600 hover:text-red-700"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												) : (
													<div className="flex gap-2 justify-end">
														<Dialog>
															<DialogTrigger
																asChild
															>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		setSelectedKey(
																			answerKey
																		)
																	}
																>
																	<Eye className="h-4 w-4" />
																</Button>
															</DialogTrigger>
															<DialogContent className="max-w-2xl">
																<DialogHeader>
																	<DialogTitle>
																		Answer
																		Key:{" "}
																		{
																			selectedKey?.courseCode
																		}
																	</DialogTitle>
																	<DialogDescription>
																		{
																			selectedKey?.courseName
																		}
																	</DialogDescription>
																</DialogHeader>
																{selectedKey && (
																	<div className="space-y-4">
																		<div className="grid grid-cols-3 gap-4 text-sm">
																			<div>
																				<span className="font-medium">
																					Questions:
																				</span>{" "}
																				{
																					selectedKey.numQuestions
																				}
																			</div>
																			<div>
																				<span className="font-medium">
																					Total
																					Marks:
																				</span>{" "}
																				{
																					selectedKey.totalMarks
																				}
																			</div>
																			<div>
																				<span className="font-medium">
																					Date
																					Added:
																				</span>{" "}
																				{new Date(
																					selectedKey.dateAdded
																				).toLocaleDateString()}
																			</div>
																		</div>
																		<div>
																			<span className="font-medium">
																				Answer
																				Key:
																			</span>
																			<div className="mt-2 p-3 bg-muted rounded font-mono text-sm break-all">
																				{
																					selectedKey.answerKey
																				}
																			</div>
																		</div>
																		<div>
																			<span className="font-medium">
																				Settings:
																			</span>
																			<ul className="mt-2 text-sm text-muted-foreground">
																				<li>
																					•
																					Negative
																					Marking:{" "}
																					{selectedKey.negativeMarking
																						? "Enabled"
																						: "Disabled"}
																				</li>
																			</ul>
																		</div>
																	</div>
																)}
															</DialogContent>
														</Dialog>

														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																handleEdit(
																	answerKey
																)
															}
														>
															<Edit className="h-4 w-4" />
														</Button>

														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																handleExport(
																	answerKey
																)
															}
														>
															<Download className="h-4 w-4" />
														</Button>

														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																handleDelete(
																	answerKey.id
																)
															}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ViewAnswerKeys;
