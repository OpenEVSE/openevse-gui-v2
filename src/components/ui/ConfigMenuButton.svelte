<script>
		import { link } from "svelte-spa-router"

		export let url
		export let name
		export let icon
</script>
<style>
	.button {
		width: 250px;
	}
	.icn {
		position: absolute;
		left: 30px;
		top: 8px;
	}
</style>

<a href={url} use:link>
	<div class="mx-2 my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center">
		<div class="is-inline-block icn">
			<iconify-icon icon={icon} class="is-size-4" />
		</div>
		{name}
	</div>
</a>