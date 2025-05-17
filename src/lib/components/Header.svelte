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
		OllamaService.init({host: 'http://localhost:11434'})
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
	<header class="main-header-clickable" on:click={toggleDropdown}>
		{#if isLoading}
			<div class="main-header-loader">
				<div class="spinner"></div>
				<span class="loader-text">Loading models...</span>
			</div>
		{:else if selectedModel}
			<div class="model-display">
				<div class="model-info-row">
					<span class="model-name-details">
						<span class="model-name">{getDisplayName(selectedModel.name)}</span>
						<span class="model-tags">
							<span class="badge-neutral mr-1">{selectedModel.format}</span>
							<span class="badge-neutral">{selectedModel.family}</span>
						</span>
					</span>
					<span class="model-size-tag">{selectedModel.size}</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="dropdown-indicator" class:rotate-180={isDropdownOpen}>
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</div>
				<div class="model-info-row mt-0.5">
					<span class="model-path">{selectedModel.fullPath.split(':')[0]}</span>
					<span class="badge-orange ml-1.5">{selectedModel.quantTag}</span>
				</div>
			</div>
			<div class="main-header-actions">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="main-header-action-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 12h9.75m-9.75 6h9.75M3.75 6h1.5m1.5 0h1.5m-1.5 0V18m1.5-12V6.75M3.75 12h1.5m1.5 0h1.5m-1.5 0V18m1.5-6V12m0-6v6m0 0v6m0-6H3.75m6.75 0H3.75M3.75 18h1.5m1.5 0h1.5m-1.5 0V12m1.5 6v-1.5m0 0V12" />
				</svg>
			</div>
		{:else}
			<div class="empty-state-text">No models available</div>
		{/if}
	</header>

	{#if isDropdownOpen && !isLoading}
		<div class="model-dropdown-panel">
			{#each modelList as model (model.id)}
				<div class="model-dropdown-item" on:click={() => selectModel(model)} on:keypress={() => selectModel(model)} role="button" tabindex="0">
					<div>
						<div class="model-info-row">
							<span class="model-name-details !max-w-full">
								<span class="model-name">{getDisplayName(model.name)}</span>
								<span class="model-tags">
									<span class="badge-neutral mr-1">{model.format}</span>
									<span class="badge-neutral">{model.family}</span>
								</span>
							</span>
							<span class="model-size-tag">{model.size}</span>
						</div>
						<div class="model-info-row mt-0.5">
							<span class="model-path !max-w-full">{model.fullPath.split(':')[0]}</span>
							<span class="badge-orange ml-1.5">{model.quantTag}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
