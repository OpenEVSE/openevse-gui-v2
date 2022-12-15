<script>
	import { link } from "svelte-spa-router"
	import Box from "../components/ui/Box.svelte"
	import Fa from "svelte-fa/src/fa.svelte";
	import {faSolarPanel, faMicrochip, faNetworkWired, faGear,faCar, faClock, faBuildingShield, faChartLine, faGlobe, faHelmetSafety} from '@fortawesome/free-solid-svg-icons/index.js'
	import {faNfcSymbol} from '@fortawesome/free-brands-svg-icons/index.js'
	import Icon from '@iconify/svelte';

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
<div class="columns is-centered is-vcentered">
	<div class="column is-two-thirds">
		<Box title = "Configuration" icon="fa6-solid:gear">
			<div class="is-flex is-flex-direction-column is-align-items-center">
				<!-- <a href="/configuration/system" use:link><div class="my-1 is-inline-block button is-info is-outlined">System</div></a> -->
				<a href="/configuration/network" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="mdi:local-area-network" width="20" /></div>Network</div></a>
				<a href="/configuration/firmware" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="fa6-solid:microchip" width="20" /></div>Firmware</div></a>
				<a href="/configuration/time" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="fa6-regular:clock" width="20" /></div>Time</div></a>
				<a href="/configuration/safety" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="mdi:shield-alert-outline" width="20" /></div>Safety</div></a>
				<a href="/configuration/evse" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="mdi:evse" width="20" /></div>EVSE</div></a>
				<a href="/configuration/http" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="mdi:web" width="20" /></div>HTTP</div></a>
				<a href="/configuration/mqtt" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class=" icn"><Icon icon="simple-icons:mqtt" /></div>MQTT</div></a>
				<a href="/configuration/rfid" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="bx:rfid" width="20" /></div>RFID</div></a>
				<a href="/configuration/shaper" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="fa6-solid:building-shield" width="20" /></div>Shaper</div></a>
				<a href="/configuration/selfproduction" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="fa-solid:solar-panel" width="20" /></div>Self Production</div></a>
				<a href="/configuration/vehicle" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="bi:ev-front" width="20" /></div>Vehicle</div></a>
				<a href="/configuration/emoncms" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="fa-solid:chart-bar" width="20" /></div>Energy Monitoring</div></a>
				<a href="/configuration/ohmconnect" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="mdi:energy-circle" width="20" /></div>Ohm Connect</div></a>
				<a href="/configuration/dev" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="mdi:console" width="20" /></div>Developper</div></a>
				<a href="/configuration/about" use:link><div class="my-1 is-inline-block button is-info is-outlined is-flex is-align-items-center"><div class="is-inline-block icn"><Icon icon="mdi:about-circle-outline" width="20" /></div>About</div></a>	
			</div>
		</Box>
	</div>
</div>