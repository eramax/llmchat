<script>
	import ChatInput from './ChatInput.svelte'
	import {v4 as uuidv4} from 'uuid'
	import MarkdownViewer from './MarkdownViewer.svelte'
	import {MarkdownStreamProcessor} from '$lib/utils/markdownStreamProcessor'
	import {onMount} from 'svelte'
	import OllamaService from '$lib/Services/OllamaService'
	const ArrowLeftIcon = '/icons/arrow-left.svg'
	const ArrowRightIcon = '/icons/arrow-right.svg'
	const InfoIcon = '/icons/info.svg'
	const EditIcon = '/icons/edit.svg'
	const CopyIcon = '/icons/copy.svg'
	const SpeakerIcon = '/icons/speaker.svg'
	const TrashIcon = '/icons/trash.svg'
	const RefreshIcon = '/icons/refresh.svg'

	let finalizedHtmlContent = $state('')
	let activeHtml = $state('')
	let isLoading = $state(true)
	let streamEnded = $state(false)

	let processor = null

	let mounted = $state(false)

	onMount(() => {
		OllamaService.init()
		processor = new MarkdownStreamProcessor({
			onStateUpdate: newState => {
				finalizedHtmlContent = newState.finalizedHtmlContent
				activeHtml = newState.activeHtml
				isLoading = newState.isLoading
				streamEnded = newState.streamEnded
			}
		})
		mounted = true
	})

	async function testOllama() {
		await processor.processStream(OllamaService.simulatedMarkdownChunks())
		console.log(finalizedHtmlContent)
	}

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
						body: [{task: 'think', content: 'Processing question...', duration: 2, isLoading: true}, {content: "I'm an AI, so I don't have feelings, but I'm functioning well! How are you?"}]
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
		{#if mounted}
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
							<div class="mt-1 text-zinc-100">
								<!-- {body.content} -->
								{#if body.isLoading}
									<div class="markdown-stream-viewer">{@html finalizedHtmlContent}</div>
									<div class="markdown-stream-viewer">{@html activeHtml}</div>
								{:else}
									<div class="markdown-stream-viewer">{@html processor.processFullMarkdown(body.content)}</div>
								{/if}
							</div>
						{/each}

						<div class="mt-2 flex {chat.direction === 'rtl' ? 'space-x-reverse' : ''} space-x-2.5 text-zinc-400 items-center">
							<!-- Instance navigation arrows -->
							{#if msg.instances.length > 1}
								<!-- Previous message -->
								<button aria-label="Previous message" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5" onclick={() => prevInstance(i)}>
									<img src={ArrowLeftIcon} alt="Previous" class="w-5 h-5" />
								</button>
								<!-- Next message -->
								<button aria-label="Next message" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5" onclick={() => nextInstance(i)}>
									<img src={ArrowRightIcon} alt="Next" class="w-5 h-5" />
								</button>
							{/if}
							<!-- Info Icon -->
							<button aria-label="More info" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
								<img src={InfoIcon} alt="Info" class="w-5 h-5" />
							</button>
							<!-- Action buttons -->

							<!-- Pencil Icon -->
							<button aria-label="Edit" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
								<img src={EditIcon} alt="Edit" class="w-5 h-5" />
							</button>
							<!-- Clipboard Icon -->
							<button aria-label="Copy" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
								<img src={CopyIcon} alt="Copy" class="w-5 h-5" />
							</button>
							<!-- Speaker Icon -->
							<button aria-label="Read aloud" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
								<img src={SpeakerIcon} alt="Read aloud" class="w-5 h-5" />
							</button>
							<!-- Trash Icon -->
							<button aria-label="Delete" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5">
								<img src={TrashIcon} alt="Delete" class="w-5 h-5" />
							</button>
							<!-- Refresh Icon -->
							<button aria-label="Regenerate response" class="hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded p-0.5" onclick={testOllama}>
								<img src={RefreshIcon} alt="Regenerate" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<ChatInput />
</div>
