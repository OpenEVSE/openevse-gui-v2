<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	export let icon
	export let color
</script>

<Fa class="is-size-5 {color}" icon={icon} />