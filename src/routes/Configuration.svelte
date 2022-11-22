<script>
	import { link } from "svelte-spa-router"
	import Status from "../components/blocks/Status.svelte"
	import Box from "../components/ui/Box.svelte"
	import Breadcrumb from "../components/ui/Breadcrumb.svelte"
</script>

<style>
	.button {
		width: 250px;
	}
</style>

<div class="columns is-centered is-vcentered">
	<div class="column is-half">
		<Box title = "Configuration">
			<div class="is-flex is-flex-direction-column is-align-items-center">
				<a href="/configuration/system" use:link><div class="my-1 is-inline-block button is-info is-outlined">System</div></a>
				<a href="/configuration/services" use:link><div class="my-1 is-inline-block button is-info is-outlined">Services</div></a>
				</div>
		</Box>
	</div>
</div>