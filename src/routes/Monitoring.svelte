<script>
	import CentralView from "./../components/ui/CentralView.svelte";
	import Box from "./../components/ui/Box.svelte";
	import Tabs from "./../components/ui/Tabs.svelte";
	import Safety from "../components/blocks/monitoring/Safety.svelte"
	import Energy from "../components/blocks/monitoring/Energy.svelte"
	import Sensors from "../components/blocks/monitoring/Sensors.svelte"
	import Current from "../components/blocks/monitoring/Current.svelte"

	let activetab = 0
	let tabs = [
		{name: "Energy", url:"/monitoring	"},
		{name: "Sensors", url:"/monitoring"},
		{name: "Safety", url:"/monitoring"},
		{name: "Settings", url:"/monitoring"}
	]

	let clickTab = (i) => {
		activetab = i
	}

</script>

<CentralView>
	<Box title="Monitoring" icon="fa6-solid:chart-simple">
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
		