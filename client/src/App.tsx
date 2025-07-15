import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FontSizeProvider } from "@/hooks/use-font-size";
import { ThemeProvider } from "@/hooks/use-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CourseSubmissions from "./pages/CourseSubmissions";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import SetAnswerKey from "./pages/SetAnswerKey";
import Settings from "./pages/Settings";
import Results from "./pages/Submissions";
import Upload from "./pages/Upload";
import ViewAnswerKeys from "./pages/ViewAnswerKeys";
const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<FontSizeProvider
				defaultFontSize="medium"
				storageKey="app-font-size"
			>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<SidebarProvider>
							<div className="min-h-screen flex w-full bg-background">
								<AppSidebar />
								<main className="flex-1 overflow-hidden">
									<Routes>
										<Route
											path="/"
											element={<Dashboard />}
										/>
										<Route
											path="/upload"
											element={<Upload />}
										/>
										<Route
											path="/submissions"
											element={<Results />}
										/>
										<Route
											path="/submissions/:courseCode"
											element={<CourseSubmissions />}
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
										<Route
											path="/login"
											element={<Login />}
										/>
										<Route
											path="/register"
											element={<Register />}
										/>
										<Route
											path="*"
											element={<NotFound />}
										/>
									</Routes>
								</main>
							</div>
						</SidebarProvider>
					</BrowserRouter>
				</TooltipProvider>
			</FontSizeProvider>
		</ThemeProvider>
	</QueryClientProvider>
);

export default App;
