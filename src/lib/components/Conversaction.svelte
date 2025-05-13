<script>
	import ChatInput from './ChatInput.svelte'
</script>

<div class="w-full text-white font-sans min-h-full flex flex-col justify-between">
	<div class="space-y-6">
		<!-- User Message -->
		<div class="flex justify-end w-full">
			<div class="bg-zinc-700 text-zinc-100 py-2 px-4 rounded-full max-w-xs lg:max-w-md">Hi</div>
		</div>

		<!-- Bot Message -->
		<div class="flex items-start space-x-3 max-w-full sm:max-w-2xl">
			<!-- Avatar -->
			<div class="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center">
				<span class="text-black font-bold text-lg select-none">OI</span>
			</div>

			<!-- Message Content -->
			<div class="flex flex-col min-w-0">
				<!-- min-w-0 for text wrapping -->
				<div class="font-semibold text-zinc-100 break-all">hf.co/unsloth/Qwen3-0.6B-GGUF:Q8_K_XL</div>
				<div class="text-sm text-zinc-400 flex items-center mt-0.5">
					Thought for 0 seconds
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 ml-1 flex-shrink-0">
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</div>
				<div class="mt-1 text-zinc-100">Hello! How can I assist you today? 😊</div>
				<div class="mt-2 flex space-x-2.5 text-zinc-400 items-center">
					<!-- Pencil Icon -->
					<button aria-label="Edit" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
						</svg>
					</button>
					<!-- Clipboard Icon -->
					<button aria-label="Copy" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25V4.506c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
							/>
						</svg>
					</button>
					<!-- Speaker Icon -->
					<button aria-label="Read aloud" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
						</svg>
					</button>
					<!-- Info Icon -->
					<button aria-label="More info" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
						</svg>
					</button>
					<!-- Thumbs Up Icon -->
					<button aria-label="Good response" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5v3.5a4.498 4.498 0 0 0 .322 1.672c.303.76.93 1.332 1.653 1.715a9.041 9.041 0 0 1 2.861 2.4c.498.634 1.225 1.08 2.031 1.08h3.367c1.034 0 1.882.712 2.065 1.72a9.026 9.026 0 0 1-.213 5.087c-.426.976-1.296 1.693-2.341 1.693H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M6.633 10.5H4.5a2.25 2.25 0 0 0-2.25 2.25v5.25a2.25 2.25 0 0 0 2.25 2.25h2.133"
							/>
						</svg>
					</button>
					<!-- Thumbs Down Icon -->
					<button aria-label="Bad response" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6.633 13.5c.806 0 1.533.446 2.031 1.08a9.041 9.041 0 0 1 2.861 2.4c.723.384 1.35.956 1.653 1.715a4.498 4.498 0 0 0 .322 1.672V21c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-3.5a4.498 4.498 0 0 0-.322-1.672c-.303-.76-.93-1.332-1.653-1.715a9.041 9.041 0 0 1-2.861-2.4c-.498-.634-1.225-1.08-2.031-1.08h-3.367a2.066 2.066 0 0 1-2.065-1.72 9.026 9.026 0 0 1 .213-5.087c.426-.976 1.296-1.693 2.341-1.693H13.48c.483 0 .964.078 1.423.23l3.114 1.04a4.501 4.501 0 0 0 1.423.23h1.633M6.633 13.5H4.5a2.25 2.25 0 0 1-2.25-2.25V6a2.25 2.25 0 0 1 2.25-2.25h2.133"
							/>
						</svg>
					</button>
					<!-- Play in Circle Icon -->
					<button aria-label="Play response" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
						</svg>
					</button>
					<!-- Refresh Icon -->
					<button aria-label="Regenerate response" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
	<ChatInput />
</div>
