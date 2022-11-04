<script>
	import { link } from "svelte-spa-router"
	import Status from "../components/blocks/Status.svelte"
	import Box from "../components/ui/Box.svelte"
	import Breadcrumb from "../components/ui/Breadcrumb.svelte"
</script>


<div class="container px-3">
	<Status />
	<Breadcrumb />
	<div class="columns is-vcentered">
		<div class="column">
			<Box title = "Configuration">
				<div><a class="has-text-info" href="/configuration/system" use:link>- System</a></div>
				<div><a class="has-text-info" href="/configuration/settings" use:link>- Settings</a></div>
				<div><a class="has-text-info" href="/configuration/charge" use:link>- Charge</a></div>
				<div><a class="has-text-info" href="/configuration/mqtt" use:link>- MQTT</a></div>
			</Box>
		</div>
	</div>
</div>