<script>
	import { link } from "svelte-spa-router"
	import Box from "../components/ui/Box.svelte"
	// import 'iconify-icon';
	// import { addIcon } from 'iconify-icon';

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
	.columns {
		height: 100%;
	}
</style>
<div class="columns is-centered is-mobile p-0 m-0">
	<div class="column is-two-thirds-tablet">
		<Box title = "Configuration" icon="fa6-solid:gear">
			<div class="is-flex is-flex-direction-column is-align-items-center">
				<!-- <a href="/configuration/system" use:link><div class="my-1 is-inline-block button is-info is-outlined">System</div></a> -->
				<a href="/configuration/network" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="mdi:local-area-network" class="is-size-4" /></div>Network</div></a>
				<a href="/configuration/firmware" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="fa6-solid:microchip" class="is-size-4" /></div>Firmware</div></a>
				<a href="/configuration/evse" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="mdi:evse" class="is-size-4" /></div>EVSE</div></a>
				<a href="/configuration/safety" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="mdi:shield-alert-outline" class="is-size-4" /></div>Safety</div></a>
				<a href="/configuration/time" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="fa6-solid:clock" class="is-size-4" /></div>Time</div></a>
				<a href="/configuration/http" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="mdi:web" class="is-size-4" /></div>HTTP</div></a>
				<a href="/configuration/mqtt" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="simple-icons:mqtt" class="is-size-4" /></div>MQTT</div></a>
				<a href="/configuration/rfid" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="bx:rfid" class="is-size-4" /></div>RFID</div></a>
				<a href="/configuration/shaper" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="fa6-solid:building-shield" class="is-size-4" /></div>Shaper</div></a>
				<a href="/configuration/selfproduction" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="fa6-solid:solar-panel" class="is-size-5" /></div>Self Production</div></a>
				<a href="/configuration/vehicle" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="bi:ev-front" class="is-size-4" /></div>Vehicle</div></a>
				<a href="/configuration/emoncms" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="fa6-solid:chart-bar" class="is-size-4" /></div>Energy Monitoring</div></a>
				<a href="/configuration/ohmconnect" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="mdi:energy-circle" class="is-size-4" /></div>Ohm Connect</div></a>
				<a href="/configuration/dev" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="mdi:console" class="is-size-4" /></div>Developper</div></a>
				<a href="/configuration/about" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><iconify-icon icon="mdi:about-circle-outline" class="is-size-4" /></div>About</div></a>	
			</div>
		</Box>
	</div>
</div>