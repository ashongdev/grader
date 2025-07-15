import {
	BarChart3,
	ChevronDown,
	Eye,
	FileKey,
	Home,
	Settings,
	Upload,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
	{ title: "Dashboard", url: "/", icon: Home },
	{ title: "Upload Sheets", url: "/upload", icon: Upload },
	{ title: "Submissions", url: "/submissions", icon: BarChart3 },
];

const answerKeyItems = [
	{ title: "Set Answer Key", url: "/set-answer-key", icon: FileKey },
	{ title: "View Answer Keys", url: "/view-answer-keys", icon: Eye },
];

const settingsItems = [{ title: "Settings", url: "/settings", icon: Settings }];

export function AppSidebar() {
	const { state } = useSidebar();
	const location = useLocation();
	const currentPath = location.pathname;
	const [answerKeysOpen, setAnswerKeysOpen] = useState(true);

	const isCollapsed = state === "collapsed";
	const isActive = (path: string) => currentPath === path;
	const isAnswerKeyActive = answerKeyItems.some((item) => isActive(item.url));

	const getNavCls = ({ isActive }: { isActive: boolean }) =>
		isActive
			? "bg-muted text-gray font-normal hover:text-primary"
			: "text-muted-foreground hover:text-primary hover:bg-muted/50";

	return (
		<Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
			<SidebarContent>
				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<NavLink
											to={item.url}
											end
											className={getNavCls}
										>
											<item.icon className="mr-2 h-4 w-4" />
											{!isCollapsed && (
												<span>{item.title}</span>
											)}
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Answer Keys Section */}
				<SidebarGroup>
					<SidebarGroupLabel>Answer Keys</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<Collapsible
								open={answerKeysOpen}
								onOpenChange={setAnswerKeysOpen}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											className={
												isAnswerKeyActive
													? "bg-muted/50"
													: ""
											}
										>
											<FileKey className="mr-2 h-4 w-4" />
											{!isCollapsed && (
												<>
													<span>Answer Keys</span>
													<ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
												</>
											)}
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{answerKeyItems.map((item) => (
												<SidebarMenuSubItem
													key={item.title}
												>
													<SidebarMenuSubButton
														asChild
													>
														<NavLink
															to={item.url}
															className={
																getNavCls
															}
														>
															<item.icon className="mr-2 h-4 w-4" />
															<span>
																{item.title}
															</span>
														</NavLink>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Settings */}
				<SidebarGroup>
					<SidebarGroupLabel>Configuration</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{settingsItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<NavLink
											to={item.url}
											end
											className={getNavCls}
										>
											<item.icon className="mr-2 h-4 w-4" />
											{!isCollapsed && (
												<span>{item.title}</span>
											)}
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
