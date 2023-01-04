<script>
	import { _ } 		from 'svelte-i18n'
	import CentralView  from "./../components/ui/CentralView.svelte";
	import Box 			from "./../components/ui/Box.svelte";
	import Tabs 		from "./../components/ui/Tabs.svelte";
	import Safety 		from "../components/blocks/monitoring/Safety.svelte"
	import Energy 		from "../components/blocks/monitoring/Energy.svelte"
	import Sensors 		from "../components/blocks/monitoring/Sensors.svelte"
	import Current 		from "../components/blocks/monitoring/Current.svelte"

	let activetab = 0
	let tabs = [
		{name: $_("monitoring-tab-energy"), url:"/monitoring	"},
		{name: $_("monitoring-tab-sensors"), url:"/monitoring"},
		{name: $_("monitoring-tab-safety"), url:"/monitoring"},
		{name: $_("monitoring-tab-settings"), url:"/monitoring"}
	]

	let clickTab = (i) => {
		activetab = i
	}

</script>

<CentralView>
	<Box title={$_("monitoring-title")} icon="fa6-solid:chart-simple">
		<Tabs tabs={tabs} {activetab} onClick={clickTab}/>
		{#if activetab == 0}
			<Energy />
		{:else if activetab == 1}
			<Sensors />	
		{:else if activetab == 2}
			<Safety />	
		{:else if activetab == 3}
			<Current />
		{/if}
	</Box>
</CentralView>
		