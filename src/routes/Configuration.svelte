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

<div class="container px-3">
	<Status />
	<Breadcrumb />
	<div class="columns is-centered">
		<div class="column">
			<Box title = "Configuration">
				<div class="is-flex is-flex-direction-column is-align-items-center">
					<a href="/configuration/system" use:link><div class="my-1 is-inline-block button is-info is-outlined">System</div></a>
					<a href="/configuration/settings" use:link><div class="my-1 is-inline-block button is-info is-outlined">Settings</div></a>
					<a href="/configuration/charge" use:link><div class="my-1 is-inline-block button is-info is-outlined">Charge</div></a>
					<a href="/configuration/mqtt" use:link><div class="my-1 is-inline-block button is-info is-outlined">MQTT</div></a>
					</div>
			</Box>
		</div>
	</div>
</div>