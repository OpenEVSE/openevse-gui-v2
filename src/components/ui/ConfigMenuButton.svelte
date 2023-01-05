<script>
		import { link } from "svelte-spa-router"

		export let url
		export let name
		export let icon
		export let height = "1.5em"
</script>
<style>
	.button {
		position: relative;
		width: 200px;
	}
	.name {
		width: 100%;
	}
</style>

<a href={url} use:link>
	<div class="mx-2 my-1 button is-info is-outlined">
		<iconify-icon inline icon={icon} {height} class=""/>
		<div class="name">{name}</div>
	
	</div>
</a>