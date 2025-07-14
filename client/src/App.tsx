import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CourseResults from "./pages/CourseResults";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Results from "./pages/Results";
import SetAnswerKey from "./pages/SetAnswerKey";
import Settings from "./pages/Settings";
import Upload from "./pages/Upload";
import ViewAnswerKeys from "./pages/ViewAnswerKeys";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<SidebarProvider>
					<div className="min-h-screen flex w-full bg-background">
						<AppSidebar />
						<main className="flex-1 overflow-hidden">
							<Routes>
								<Route path="/" element={<Dashboard />} />
								<Route path="/upload" element={<Upload />} />
								<Route path="/results" element={<Results />} />
								<Route
									path="/results/:courseId"
									element={<CourseResults />}
								/>
								<Route
									path="/settings"
									element={<Settings />}
								/>
								<Route
									path="/set-answer-key"
									element={<SetAnswerKey />}
								/>
								<Route
									path="/view-answer-keys"
									element={<ViewAnswerKeys />}
								/>
								<Route path="/login" element={<Login />} />
								<Route
									path="/register"
									element={<Register />}
								/>
								<Route path="*" element={<NotFound />} />
							</Routes>
						</main>
					</div>
				</SidebarProvider>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
