<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	export let icon
	export let color
	export let bp
</script>

<Fa size={bp == "mobilemini"?"1.3x":"1x"} class={color} icon={icon}/>