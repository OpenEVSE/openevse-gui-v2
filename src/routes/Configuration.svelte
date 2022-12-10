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
	<div class="column is-two-thirds">
		<Box title = "Configuration">
			<div class="is-flex is-flex-direction-column is-align-items-center">
				<!-- <a href="/configuration/system" use:link><div class="my-1 is-inline-block button is-info is-outlined">System</div></a> -->
				<a href="/configuration/network" use:link><div class="my-1 is-inline-block button is-info is-outlined">Network</div></a>
				<a href="/configuration/firmware" use:link><div class="my-1 is-inline-block button is-info is-outlined">Firmware</div></a>
				<a href="/configuration/time" use:link><div class="my-1 is-inline-block button is-info is-outlined">Time</div></a>
				<a href="/configuration/safety" use:link><div class="my-1 is-inline-block button is-info is-outlined">Safety</div></a>
				<a href="/configuration/http" use:link><div class="my-1 is-inline-block button is-info is-outlined">HTTP</div></a>
				<a href="/configuration/mqtt" use:link><div class="my-1 is-inline-block button is-info is-outlined">MQTT</div></a>
				<a href="/configuration/rfid" use:link><div class="my-1 is-inline-block button is-info is-outlined">RFID</div></a>
				<a href="/configuration/unballasting" use:link><div class="my-1 is-inline-block button is-info is-outlined">Unballasting</div></a>
				<a href="/configuration/production" use:link><div class="my-1 is-inline-block button is-info is-outlined">Energy Production</div></a>
				<a href="/configuration/vehicle" use:link><div class="my-1 is-inline-block button is-info is-outlined">Vehicle</div></a>
				<a href="/configuration/emoncms" use:link><div class="my-1 is-inline-block button is-info is-outlined">EmonCMS</div></a>
				<a href="/configuration/ohm" use:link><div class="my-1 is-inline-block button is-info is-outlined">Ohm Connect</div></a>
				</div>
		</Box>
	</div>
</div>