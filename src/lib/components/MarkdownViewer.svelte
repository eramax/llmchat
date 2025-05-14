<script>
	import {onMount} from 'svelte'
	import {MarkdownStreamProcessor} from '$lib/utils/markdownStreamProcessor'

	// Svelte 5 state variables
	let finalizedHtmlContent = $state('')
	let activeHtml = $state('')
	let isLoading = $state(true)
	let streamEnded = $state(false)

	let processor

	onMount(() => {
		processor = new MarkdownStreamProcessor({
			onStateUpdate: newState => {
				finalizedHtmlContent = newState.finalizedHtmlContent
				activeHtml = newState.activeHtml
				isLoading = newState.isLoading
				streamEnded = newState.streamEnded
			}
		})
		// Start a stream when the component mounts (e.g., simulation or real fetch)
		startSimulatedStream()
		// or: startRealStream('/api/my-markdown-stream-endpoint');
	})

	function startSimulatedStream() {
		if (processor) {
			//processor.processStream(simulatedMarkdownChunks())
		}
	}


</script>

<div class="markdown-stream-viewer">
	{#if isLoading && !finalizedHtmlContent && !activeHtml}
		<p>Loading stream...</p>
	{/if}

	<!-- Finalized Content -->
	{#if finalizedHtmlContent}
		<div class="prose dark:prose-invert">{@html finalizedHtmlContent}</div>
	{/if}

	<!-- Active Content: Shows the rendering of the currently "typing" or incomplete part -->
	{#if activeHtml && (isLoading || !streamEnded)}
		<div class="prose dark:prose-invert">{@html activeHtml}</div>
	{/if}

	{#if streamEnded && !isLoading}
		<p class="stream-status"><em>Stream ended.</em></p>
	{/if}

	<button onclick={startSimulatedStream} disabled={isLoading}>Restart Simulation</button>
	<!--
	<button onclick={() => startRealStream('/api/your-endpoint')} disabled={isLoading}>
		Fetch Real Stream
	</button>
	-->
</div>
