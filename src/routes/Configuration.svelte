<script>
	import Breadcrumb from "../components/ui/Breadcrumb.svelte"
	import { link } from "svelte-spa-router"
</script>


<div class="container px-3">
	<Breadcrumb />
	<div class="columns is-vcentered">
		<div class="column">
			<div><a class="button" href="/configuration/system" use:link>System</a></div>
			<div><a class="button" href="/configuration/settings" use:link>Settings</a></div>
			<div><a class="button" href="/configuration/charge" use:link>Charge</a></div>
			<div><a class="button" href="/configuration/mqtt" use:link>MQTT</a></div>
		</div>
	</div>
</div>