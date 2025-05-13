<script>
	import {onMount} from 'svelte'
	import OllamaService from '$lib/Services/OllamaService.js'

	let modelList = []
	let selectedModel = null
	let isDropdownOpen = false
	let isLoading = true

	function processModels(rawModels) {
		return rawModels
			.map(model => {
				// Extract model name from the path (last part after the last '/')
				const fullPath = model.name
				const pathParts = fullPath.split('/')
				const nameWithTag = pathParts[pathParts.length - 1]
				const nameParts = nameWithTag.split(':')
				const modelName = nameParts[0]
				const quantTag = nameParts.length > 1 ? nameParts[1] : ''

				return {
					id: model.model,
					name: modelName,
					fullPath: fullPath,
					format: model.details.format || 'unknown',
					family: model.details.family || 'unknown',
					size: model.details.parameter_size || 'unknown',
					quantTag: quantTag,
					modifiedAt: new Date(model.modified_at)
				}
			})
			.sort((a, b) => b.modifiedAt - a.modifiedAt) // Sort by most recent
	}

	onMount(async () => {
		const rawModelData = await OllamaService.getModels()
		modelList = processModels(rawModelData.models)
		if (modelList.length > 0) {
			selectedModel = modelList[0]
		}
		isLoading = false
	})

	function selectModel(model) {
		selectedModel = model
		isDropdownOpen = false
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen
	}

	// Extract the model name for display (without the repo path)
	function getDisplayName(fullPath) {
		const parts = fullPath.split('/')
		return parts[parts.length - 1].split('-GGUF')[0]
	}
</script>

<div class="relative">
	<!-- Header with fixed height -->
	<header class="p-3 border border-neutral-800 rounded-md flex justify-between items-center shrink-0 bg-neutral-900 cursor-pointer h-[74px]" on:click={toggleDropdown}>
		{#if isLoading}
			<!-- Loading indicator -->
			<div class="flex items-center justify-center w-full">
				<div class="animate-spin rounded-full h-5 w-5 border-t-2 border-l-2 border-blue-500"></div>
				<span class="ml-2 text-sm text-neutral-400">Loading models...</span>
			</div>
		{:else if selectedModel}
			<div>
				<div class="flex items-center">
					<span class="text-sm text-neutral-100 truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
						<span class="font-medium">{getDisplayName(selectedModel.name)}</span>
						<span class="text-neutral-400 ml-2">
							<span class="bg-neutral-800 text-neutral-300 text-xs px-1.5 py-0.5 rounded mr-1">{selectedModel.format}</span>
							<span class="bg-neutral-800 text-neutral-300 text-xs px-1.5 py-0.5 rounded">{selectedModel.family}</span>
						</span>
					</span>
					<span class="bg-blue-600/80 text-xs px-2 py-0.5 rounded ml-2 font-medium">{selectedModel.size}</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 ml-1 text-neutral-500 shrink-0" class:rotate-180={isDropdownOpen}>
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</div>
				<div class="flex items-center mt-0.5">
					<span class="text-xs text-neutral-500 truncate max-w-xs">{selectedModel.fullPath.split(':')[0]}</span>
					<span class="text-xs bg-orange-600/40 text-orange-200 px-1.5 rounded ml-1.5">{selectedModel.quantTag}</span>
				</div>
			</div>
			<div class="flex items-center space-x-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-neutral-400 hover:text-neutral-100 cursor-pointer transition-colors">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 12h9.75m-9.75 6h9.75M3.75 6h1.5m1.5 0h1.5m-1.5 0V18m1.5-12V6.75M3.75 12h1.5m1.5 0h1.5m-1.5 0V18m1.5-6V12m0-6v6m0 0v6m0-6H3.75m6.75 0H3.75M3.75 18h1.5m1.5 0h1.5m-1.5 0V12m1.5 6v-1.5m0 0V12" />
				</svg>
			</div>
		{:else}
			<!-- No model selected state -->
			<div class="text-sm text-neutral-400 w-full text-center">No models available</div>
		{/if}
	</header>

	<!-- Dropdown for model selection -->
	{#if isDropdownOpen && !isLoading}
		<div class="absolute z-10 mt-1 w-full bg-neutral-900 border border-neutral-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
			{#each modelList as model (model.id)}
				<div class="p-2 hover:bg-neutral-800 cursor-pointer transition-colors border-b border-neutral-800 last:border-b-0" on:click={() => selectModel(model)}>
					<div class="flex items-center justify-between">
						<div>
							<div class="flex items-center">
								<span class="text-sm text-neutral-100">
									<span class="font-medium">{getDisplayName(model.name)}</span>
									<span class="ml-2">
										<span class="bg-neutral-800 text-neutral-300 text-xs px-1 py-0.5 rounded mr-1">{model.format}</span>
										<span class="bg-neutral-800 text-neutral-300 text-xs px-1 py-0.5 rounded">{model.family}</span>
									</span>
								</span>
								<span class="bg-blue-600/80 text-xs px-1.5 py-0.5 rounded ml-2 font-medium">{model.size}</span>
							</div>
							<div class="flex items-center mt-0.5">
								<span class="text-xs text-neutral-500 truncate max-w-xs">{model.fullPath.split(':')[0]}</span>
								<span class="text-xs bg-orange-600/40 text-orange-200 px-1.5 rounded ml-1.5">{model.quantTag}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
