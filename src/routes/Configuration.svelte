<script>
	import { _ } 				from 'svelte-i18n'
	import ConfigMenuButton 	from "./../components/ui/ConfigMenuButton.svelte";
	import CentralView 			from "./../components/ui/CentralView.svelte";
	import Box 					from "../components/ui/Box.svelte"
	

</script>

<CentralView>
	<Box title = "Configuration" icon="fa6-solid:gear">
			<div class="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap">
				<ConfigMenuButton url="/configuration/network" icon="mdi:local-area-network" name={$_("config.titles.network")} />
				<ConfigMenuButton url="/configuration/firmware" icon="fa6-solid:microchip" name={$_("config.titles.firmware")} />
				<ConfigMenuButton url="/configuration/evse" icon="mdi:evse" name={$_("config.titles.evse")} />
				<ConfigMenuButton url="/configuration/safety" icon="mdi:shield-alert-outline" name={$_("config.titles.safety")} />
				<ConfigMenuButton url="/configuration/time" icon="fa6-solid:clock" name={$_("config.titles.time")} />
				<ConfigMenuButton url="/configuration/http" icon="mdi:web" name={$_("config.titles.http")} />
				<ConfigMenuButton url="/configuration/mqtt" icon="simple-icons:mqtt" name={$_("config.titles.mqtt")} />
				<ConfigMenuButton url="/configuration/rfid" icon="bx:rfid" name={$_("config.titles.rfid")} />
				<ConfigMenuButton url="/configuration/shaper" icon="fa6-solid:building-shield" name={$_("config.titles.shaper")} />
				<ConfigMenuButton url="/configuration/selfproduction" icon="fa6-solid:solar-panel" name={$_("config.titles.selfprod")} height="1.3em" />
				<ConfigMenuButton url="/configuration/vehicle" icon="bi:ev-front" name={$_("config.titles.vehicle")} />
				<ConfigMenuButton url="/configuration/ocpp" icon="custom:ocpp" name={$_("config.titles.ocpp")} />
				<ConfigMenuButton url="/configuration/emoncms" icon="fa6-solid:chart-bar" name={$_("config.titles.emon")} />
				<ConfigMenuButton url="/configuration/ohmconnect" icon="mdi:energy-circle" name={$_("config.titles.ohm")} />
				<ConfigMenuButton url="/configuration/dev" icon="mdi:console" name={$_("config.titles.dev")} />
				<ConfigMenuButton url="/configuration/about" icon="mdi:about-circle-outline" name={$_("config.titles.about")} />
			</div>
	</Box>
</CentralView>