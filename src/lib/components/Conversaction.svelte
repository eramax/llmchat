<script>
	import ChatInput from './ChatInput.svelte'
	import {v4 as uuidv4} from 'uuid'

	let chat = $state({
		id: 'chat-1',
		title: 'Chat Title',
		createdAt: '2023-10-01T12:00:00Z',
		updatedAt: '2023-10-01T12:00:00Z',
		createdBy: 'user-1',
		direction: 'ltr',
		messages: [
			{
				role: 'user',
				active_id: 0,
				instances: [
					{
						message_id: 'uuid-1',
						createdAt: '2023-10-01T12:00:00Z',
						createdBy: 'Ahmed',
						parent_message_id: null,
						body: [{content: 'Hi'}]
					},
					{
						message_id: 'uuid-1a',
						createdAt: '2023-10-01T12:05:00Z',
						createdBy: 'Ahmed',
						parent_message_id: null,
						body: [{content: 'How are you?'}]
					}
				]
			},
			{
				role: 'assistant',
				active_id: 0,
				instances: [
					// Branch 1: Responses to "Hi" (uuid-1)
					{
						message_id: 'uuid-2',
						createdAt: '2023-10-01T12:01:00Z',
						createdBy: 'llama3-7B',
						parent_message_id: 'uuid-1', // Parent is "Hi"
						metadata: {token_count: 10, tokenpersecond: 5},
						body: [{task: 'think', content: 'Thinking...', duration: 5}, {content: 'Hello! How can I assist you today? 😊'}]
					},
					{
						message_id: 'uuid-3',
						createdAt: '2023-10-01T12:02:00Z',
						createdBy: 'llama3-8B',
						parent_message_id: 'uuid-1', // Parent is "Hi"
						metadata: {token_count: 15, tokenpersecond: 7},
						body: [{task: 'think', content: 'Analyzing greeting...', duration: 3}, {content: 'Hi there! What can I help you with?'}]
					},
					// Branch 2: Responses to "How are you?" (uuid-1a)
					{
						message_id: 'uuid-4',
						createdAt: '2023-10-01T12:06:00Z',
						createdBy: 'llama3-7B',
						parent_message_id: 'uuid-1a', // Parent is "How are you?"
						metadata: {token_count: 12, tokenpersecond: 5},
						body: [{task: 'think', content: 'Processing question...', duration: 2}, {content: "I'm an AI, so I don't have feelings, but I'm functioning well! How are you?"}]
					}
				]
			},
			{
				role: 'user',
				active_id: 0,
				instances: [
					// Branch 1A: Follow-up to first response to "Hi"
					{
						message_id: 'uuid-5',
						createdAt: '2023-10-01T12:03:00Z',
						createdBy: 'Ahmed',
						parent_message_id: 'uuid-2', // Parent is first response to "Hi"
						body: [{content: 'I need help with coding.'}]
					},
					// Branch 1B: Follow-up to second response to "Hi"
					{
						message_id: 'uuid-6',
						createdAt: '2023-10-01T12:04:00Z',
						createdBy: 'Ahmed',
						parent_message_id: 'uuid-3', // Parent is second response to "Hi"
						body: [{content: 'Can you explain machine learning?'}]
					},
					// Branch 2A: Follow-up to response to "How are you?"
					{
						message_id: 'uuid-7',
						createdAt: '2023-10-01T12:07:00Z',
						createdBy: 'Ahmed',
						parent_message_id: 'uuid-4', // Parent is response to "How are you?"
						body: [{content: "I'm good! Tell me about yourself."}]
					}
				]
			},
			{
				role: 'assistant',
				active_id: 0,
				instances: [
					// Branch 1A: Response to "I need help with coding"
					{
						message_id: 'uuid-8',
						createdAt: '2023-10-01T12:03:30Z',
						createdBy: 'llama3-7B',
						parent_message_id: 'uuid-5', // Parent is "I need help with coding"
						metadata: {token_count: 25, tokenpersecond: 8},
						body: [{task: 'think', content: 'Analyzing coding request...', duration: 4}, {content: 'I can certainly help with coding! What programming language or problem are you working with?'}]
					},
					// Branch 1B: Response to "Can you explain machine learning?"
					{
						message_id: 'uuid-9',
						createdAt: '2023-10-01T12:04:30Z',
						createdBy: 'llama3-8B',
						parent_message_id: 'uuid-6', // Parent is "Can you explain machine learning?"
						metadata: {token_count: 45, tokenpersecond: 9},
						body: [{task: 'think', content: 'Formulating ML explanation...', duration: 5}, {content: 'Machine learning is a subset of AI where systems learn from data and improve without explicit programming. The main types are supervised, unsupervised, and reinforcement learning.'}]
					},
					// Branch 2A: Response to "I'm good! Tell me about yourself."
					{
						message_id: 'uuid-10',
						createdAt: '2023-10-01T12:08:00Z',
						createdBy: 'llama3-7B',
						parent_message_id: 'uuid-7', // Parent is "I'm good! Tell me about yourself."
						metadata: {token_count: 30, tokenpersecond: 6},
						body: [{task: 'think', content: 'Preparing self-description...', duration: 3}, {content: "I'm an AI assistant built on the Llama 3 architecture. I was trained on a diverse dataset to help users with a wide range of tasks including answering questions, creative writing, and problem-solving."}]
					}
				]
			}
		]
	})

	function navigateBranch(messageIndex, direction) {
		const msg = chat.messages[messageIndex]
		msg.active_id = (msg.active_id + direction + msg.instances.length) % msg.instances.length
		updateDownstream(messageIndex + 1, msg.instances[msg.active_id].message_id)
	}

	function updateDownstream(fromIndex, parentId) {
		for (let i = fromIndex; i < chat.messages.length; i++) {
			const instances = chat.messages[i].instances
			const children = instances.filter(inst => inst.parent_message_id === parentId)

			if (!children.length) break

			const latestChild = children.reduce((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? a : b))

			chat.messages[i].active_id = instances.indexOf(latestChild)
			parentId = latestChild.message_id
		}
	}

	function createInstance(messageIndex, content) {
		const msg = chat.messages[messageIndex]
		const parentInst = msg.instances[msg.active_id]

		const newInst = {
			message_id: uuidv4(),
			createdAt: new Date().toISOString(),
			parent_message_id: parentInst.message_id,
			body: [{content}],
			createdBy: 'user'
		}

		msg.instances = [...msg.instances, newInst]
		msg.active_id = msg.instances.length - 1
		updateDownstream(messageIndex + 1, newInst.message_id)
	}

	// Public API
	const nextInstance = i => navigateBranch(i, 1)
	const prevInstance = i => navigateBranch(i, -1)
	const newInstance = (i, c) => createInstance(i, c)
</script>

<div class="w-full text-white font-sans min-h-full flex flex-col justify-between" class:rtl={chat.direction === 'rtl'} dir={chat.direction}>
	<div class="space-y-6">
		<!-- Dynamically render all messages -->
		{#each chat.messages as msg, i (i)}
			<!-- Assistant Messages -->
			<div class="flex items-start {chat.direction === 'rtl' ? 'flex-row-reverse space-x-reverse' : 'space-x-3'} max-w-full sm:max-w-2xl">
				<!-- Avatar -->
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center">
					<span class="text-black font-bold text-lg select-none">{msg.role.replace('assistant', 'AI')}</span>
				</div>

				<!-- Message Content -->
				<div class="flex flex-col min-w-0 relative group">
					<div class="font-semibold text-zinc-100 break-all">{msg.instances[msg.active_id].createdBy}</div>
					<div class="text-sm text-zinc-400 flex items-center mt-0.5">
						Thought for 10 seconds...
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 ml-1 flex-shrink-0">
							<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
						</svg>
					</div>
					{#each msg.instances[msg.active_id].body as body, bodyIndex}
						<div class="mt-1 text-zinc-100">{body.content}</div>
					{/each}

					<div class="mt-2 flex {chat.direction === 'rtl' ? 'space-x-reverse' : ''} space-x-2.5 text-zinc-400 items-center">
						<!-- Instance navigation arrows -->
						{#if msg.instances.length > 1}
							<!-- Previous message -->
							<button aria-label="Previous message" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5" onclick={() => prevInstance(i)}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
								</svg>
							</button>
							<!-- Next message -->
							<button aria-label="Next message" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5" onclick={() => nextInstance(i)}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
								</svg>
							</button>
						{/if}
						<!-- Info Icon -->
						<button aria-label="More info" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
								<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
							</svg>
						</button>
						<!-- Action buttons -->

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
						<!-- Trash Icon -->
						<button aria-label="Delete" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18.75V8.25m12 10.5V8.25M4.5 6h15m-15 0a2.25 2.25 0 0 1 2.25-2.25h6A2.25 2.25 0 0 1 12 6m0 0h6m-6 0H4.5m9.75 0v12a2.25 2.25 0 1 1-4.5 0V6m4.5 0h3a2.25 2.25 0 1 1-4.5 0Z" />
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
		{/each}
	</div>
	<ChatInput />
</div>
