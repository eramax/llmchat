<script>
	import ChatInput from '$lib/components/ChatInput.svelte'
	import Suggestions from '$lib/components/Suggestions.svelte'
</script>

<div class="max-w-2xl w-full flex flex-col items-center mb-auto mt-auto">
	<ChatInput />

	<!-- Suggested Prompts -->
	<Suggestions />
</div>
