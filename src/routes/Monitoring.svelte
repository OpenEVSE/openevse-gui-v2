<script>
	import { _ } 		from 'svelte-i18n'
	import CentralView  from "./../components/ui/CentralView.svelte";
	import Box 			from "./../components/ui/Box.svelte";
	import Tabs 		from "./../components/ui/Tabs.svelte";
	import Safety 		from "../components/blocks/monitoring/Safety.svelte"
	import Data 		from "../components/blocks/monitoring/Data.svelte"
	import Manager 		from "../components/blocks/monitoring/Manager.svelte"

	let activetab = 0
	let tabs = [
		{name: $_("monitoring-tab-data"), url:"/monitoring	"},
		{name: $_("monitoring-tab-safety"), url:"/monitoring"},
		{name: $_("monitoring-tab-manager"), url:"/monitoring"}
	]

	let clickTab = (i) => {
		activetab = i
	}

</script>

<CentralView>
	<Box title={$_("monitoring-title")} icon="fa6-solid:chart-simple">
		<Tabs tabs={tabs} {activetab} onClick={clickTab}/>
		{#if activetab == 0}
			<Data />
		{:else if activetab == 1}
			<Safety />	
		{:else if activetab == 2}
			<Manager />
		{/if}
	</Box>
</CentralView>
		