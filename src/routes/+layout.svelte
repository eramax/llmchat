<script>
	import Header from '$lib/components/Header.svelte'
	import Sidebar from '$lib/components/Sidebar.svelte'
	import '../app.css'

	let {children} = $props()
</script>

<div class="flex h-screen text-neutral-300">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main Content -->
	<main class="flex-1 flex flex-col bg-neutral-900">
		<!-- Main content header -->
		<Header />

		<!-- Chat area -->
		<div class="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 relative text-neutral-400 overflow-y-auto">
			{@render children()}
		</div>
	</main>
</div>
