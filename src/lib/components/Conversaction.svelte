<script>
	import ChatInput from './ChatInput.svelte'
	import {v4 as uuidv4} from 'uuid'
	import {MarkdownStreamProcessor} from '$lib/utils/markdownStreamProcessor'
	import {onMount} from 'svelte'
	import OllamaService from '$lib/Services/OllamaService'
	import Terminal from './Terminal.svelte'

	const ArrowLeftIcon = '/icons/arrow-left.svg'
	const ArrowRightIcon = '/icons/arrow-right.svg'
	const InfoIcon = '/icons/info.svg'
	const EditIcon = '/icons/edit.svg'
	const CopyIcon = '/icons/copy.svg'
	const SpeakerIcon = '/icons/speaker.svg'
	const TrashIcon = '/icons/trash.svg'
	const RefreshIcon = '/icons/refresh.svg'
	import {loadChat} from '$lib/Services/ChatService.svelte.js'

	let finalizedHtmlContent = $state('')
	let activeHtml = $state('')
	let isLoading = $state(true)
	let streamEnded = $state(false)

	let processor
	let mounted = $state(false)
	let chat = $state({})
	onMount(async () => {
		OllamaService.init()
		chat = await loadChat()
		processor = new MarkdownStreamProcessor({
			onStateUpdate: newState => {
				finalizedHtmlContent = newState.finalizedHtmlContent
				activeHtml = newState.activeHtml
				isLoading = newState.isLoading
				streamEnded = newState.streamEnded
			}
		})
		processor.use('<Terminal>', Terminal)
		mounted = true
	})

	async function testOllama() {
		await processor.processStream(OllamaService.simulatedMarkdownChunks())
	}

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

{#if mounted}
	<div class="chat-panel">
		<div class="chat-window" class:rtl={chat.direction === 'rtl'} dir={chat.direction}>
			<div class="message-list">
				{#each chat.messages as msg, i (i)}
					<div class="message-bubble" class:flex-row-reverse={chat.direction === 'rtl'} class:space-x-reverse={chat.direction === 'rtl'} class:space-x-3={chat.direction !== 'rtl'}>
						<div class="message-avatar-container">
							<span class="message-avatar-id">{msg.role.replace('assistant', 'AI')}</span>
						</div>
						<div class="message-text-content">
							<div class="message-sender">{msg.instances[msg.active_id].createdBy}</div>
							<div class="message-timing">
								Thought for 10 seconds...
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="message-timing-icon">
									<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
								</svg>
							</div>
							{#each msg.instances[msg.active_id].body as bodyPart (bodyPart.content)}
								<div class="message-body">
									{#if bodyPart.isLoading}
										<div class="markdown-stream-viewer">{@html finalizedHtmlContent}</div>
										<div class="markdown-stream-viewer">{@html activeHtml}</div>
									{:else}
										<div class="prose dark:prose-invert max-w-full pr-10">{@html processor.processFullMarkdown(bodyPart.content)}</div>
									{/if}
								</div>
							{/each}
							<div class="message-actions-toolbar" class:space-x-reverse={chat.direction === 'rtl'}>
								{#if msg.instances.length > 1}
									<button aria-label="Previous message" class="btn-icon-chat" onclick={() => prevInstance(i)}>
										<img src={ArrowLeftIcon} alt="Previous" class="message-action-icon" />
									</button>
									<button aria-label="Next message" class="btn-icon-chat" onclick={() => nextInstance(i)}>
										<img src={ArrowRightIcon} alt="Next" class="message-action-icon" />
									</button>
								{/if}
								<button aria-label="More info" class="btn-icon-chat"><img src={InfoIcon} alt="Info" class="message-action-icon" /></button>
								<button aria-label="Edit" class="btn-icon-chat"><img src={EditIcon} alt="Edit" class="message-action-icon" /></button>
								<button aria-label="Copy" class="btn-icon-chat"><img src={CopyIcon} alt="Copy" class="message-action-icon" /></button>
								<button aria-label="Read aloud" class="btn-icon-chat"><img src={SpeakerIcon} alt="Read aloud" class="message-action-icon" /></button>
								<button aria-label="Delete" class="btn-icon-chat"><img src={TrashIcon} alt="Delete" class="message-action-icon" /></button>
								<button aria-label="Regenerate response" class="btn-icon-chat" onclick={testOllama}>
									<img src={RefreshIcon} alt="Regenerate" class="message-action-icon" />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<ChatInput />
		</div>
	</div>
{/if}
