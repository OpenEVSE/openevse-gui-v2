<script>
	import ConfigMenuButton from "./../components/ui/ConfigMenuButton.svelte";
	import CentralView from "./../components/ui/CentralView.svelte";
	import Box from "../components/ui/Box.svelte"
	import 'iconify-icon';

</script>

<CentralView>
	<Box title = "Configuration" icon="fa6-solid:gear">
		<div class="is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-center">
			<ConfigMenuButton url="/configuration/network" icon="mdi:local-area-network" name="Network" />
			<ConfigMenuButton url="/configuration/firmware" icon="fa6-solid:microchip" name="Firmware" />
			<ConfigMenuButton url="/configuration/evse" icon="mdi:evse" name="EVSE" />
			<ConfigMenuButton url="/configuration/safety" icon="mdi:shield-alert-outline" name="Safety" />
			<ConfigMenuButton url="/configuration/time" icon="fa6-solid:clock" name="Time" />
			<ConfigMenuButton url="/configuration/http" icon="mdi:web" name="HTTP" />
			<ConfigMenuButton url="/configuration/mqtt" icon="simple-icons:mqtt" name="MQTT" />
			<ConfigMenuButton url="/configuration/rfid" icon="bx:rfid" name="RFID" />
			<ConfigMenuButton url="/configuration/shaper" icon="fa6-solid:building-shield" name="Shaper" />
			<ConfigMenuButton url="/configuration/selfproduction" icon="fa6-solid:solar-panel" name="Self Production" />
			<ConfigMenuButton url="/configuration/vehicle" icon="bi:ev-front" name="Vehicle" />
			<ConfigMenuButton url="/configuration/emoncms" icon="fa6-solid:chart-bar" name="Energy Monitoring" />
			<ConfigMenuButton url="/configuration/ohmconnect" icon="mdi:energy-circle" name="Ohm Connect" />
			<ConfigMenuButton url="/configuration/dev" icon="mdi:console" name="Developper" />
			<ConfigMenuButton url="/configuration/about" icon="mdi:about-circle-outline" name="About" />
		</div>
	</Box>
</CentralView>