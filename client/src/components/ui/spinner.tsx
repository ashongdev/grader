const Spinner = () => (
	<div className="flex justify-center items-center space-x-2">
		<div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
		<span className="text-sm text-muted-foreground">Loading...</span>
	</div>
);

export default Spinner;
