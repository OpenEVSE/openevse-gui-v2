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
		console.log("tab:" + i)
	}
</script>

<style>
</style>

<CentralView>
	<Box title="Vehicle" icon="bi:ev-front" has_help={activetab==1?true:false}>
		<div slot="help"><VehicleTeslaHelp /> </div>
		<Tabs tabs={tabs} {activetab} onClick={clickTab}/>
		{#if activetab == 0}
			<VehicleStatus/>
		{:else if activetab == 1}
			<Vehicle />
		{/if}
	</Box>
</CentralView>


