<script>
	import ProgressBar from "./../../ui/ProgressBar.svelte";
	import { config_store } 	from "./../../../lib/stores/config.js";
	import { uistates_store } 	from "./../../../lib/stores/uistates.js";
	import { history_store } 	from "./../../../lib/stores/history.js"
	import { onMount } 			from "svelte"
	import { serialQueue } 		from "./../../../lib/queue.js";
	import {httpAPI,
			formatDate,
		    round,
			state2icon,
			type2icon} 			from "../../../lib/utils.js"
	import Box 					from "./../../ui/Box.svelte"
	import Loader 				from "./../../ui/Loader.svelte";

	let index
	let loaded = false
	let progress = 0

	async function init() {
		index = await serialQueue.add(() => httpAPI("GET","/logs"))
		if ($uistates_store.logidx_min != index.min || $uistates_store.logidx_max != index.max) {
			loaded = false
			//refresh data
			$uistates_store.logidx_min = index.min
			$uistates_store.logidx_max = index.max
			//reset history
			$history_store = ""
			for (let i = index.min; i <= index.max; i++) {progress = (i - index.min)*100/(index.max-index.min)
				await serialQueue.add(() => history_store.download(i))
				
			}
			loaded = true
			
		}
		else {
			progress = 100
			await serialQueue.add(() => history_store.download(index.max))
				loaded = true
		}
		
	}

	onMount(()=>{
		init()

	})

</script>
<style>
	.table {
		max-width: 600px;
	}
	
</style>

<Box title="History" icon="icon-park-outline:history-query">
		<div class="has-text-centered" style=" height: 100%;" >
			{#if !loaded}
			<div class="box has-text-centered is-size-6 has-text-weight-bold is-flex is-flex-direction-column">
				<div class="mb-4">Loading Data</div>
				<!-- <Loader size="is-size-4" color="has-text-info"/> -->
				<ProgressBar value={progress} />
			</div>
			{:else}
			<div class="table-container">
				<table class="table is-size-7-mobile is-size-6 is-fullwidth">
					<thead>
						<tr>
							<th><abbr title="Time">Time</abbr></th>
							<th><abbr title="Type">Type</abbr></th>
							<th><abbr title="Status">Status</abbr></th>
							<th><abbr title="Energy">Kwh</abbr></th>
							<th><abbr title="Temperature">T°</abbr></th>
						</tr>
					</thead>
					<tbody>
						{#each $history_store as item}
						<tr>
							<th>{formatDate(item.time,$config_store.time_zone, "short")}</th>
							<td class="has-tooltip" data-tooltip={item.type}>
								<iconify-icon icon="{type2icon(item.type)}"  class="{item.type=="warning"?"has-text-danger":"has-text-info"} is-size-5"></iconify-icon>
							</td	>
							<td class="has-tooltip" data-tooltip={state2icon(item.evseState).tooltip}>
								<iconify-icon  class="{state2icon(item.evseState).color} is-size-5" icon={state2icon(item.evseState).type}></iconify-icon>
							</td>
							<td class="has-text-weight-bold">{round(item.energy/1000,1)}</td>
							<td class="has-text-weight-bold">{item.temperature}</td>
						</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{/if}
		</div>
	
</Box>