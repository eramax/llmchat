<script>
	import {onMount} from 'svelte'
	onMount(() => {
		console.log('Terminal component mounted')
	})
</script>

<code>
	<pre>
	    {@render children()}
    </pre>
</code>
