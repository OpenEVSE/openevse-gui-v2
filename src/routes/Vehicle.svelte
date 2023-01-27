<script>
	import { _ } 		    from 'svelte-i18n'
	import VehicleStatus 	from "./../components/blocks/configuration/VehicleStatus.svelte";
	import Box 				from "./../components/ui/Box.svelte";
	import CentralView 		from "./../components/ui/CentralView.svelte";
	import Vehicle 			from "../components/blocks/configuration/Vehicle.svelte"
	import Tabs 			from "./../components/ui/Tabs.svelte";
	import VehicleTeslaHelp from "./../components/help/VehicleTeslaHelp.svelte";

	let activetab = 0
	let tabs = [
		{name: $_("config.vehicle.status"), url:"/configuration/vehicle"},
		{name: $_("config.vehicle.setup"), url:"/configuration/vehicle"}
	]

	let clickTab = (i) => {
		activetab = i
	}
</script>

<style>
</style>

<CentralView>
	<Box title="Vehicle" icon="bi:ev-front" has_help={activetab==1?true:false} back={true}>
		<div slot="help"><VehicleTeslaHelp /> </div>
		<div>
			<Tabs tabs={tabs} {activetab} onClick={clickTab}/>
		</div>
		<div class="content">
			{#if activetab == 0}
			<VehicleStatus/>
			{:else}
			<Vehicle />
			{/if}
		</div>

	</Box>
</CentralView>


