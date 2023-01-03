<script>
	import Borders from "./../../ui/Borders.svelte";
	import ProgressBar			from "./../../ui/ProgressBar.svelte";
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
		<div class="has-text-centered is-flex-grow-1 is-flex is-justify-content-center" style="height: 100%;">
			{#if !loaded}
			<div class="is-flex-shrink-0 is-flex-grow-1 is-flex is-align-items-center is-justify-content-center" style="min-height: 100%:">
				<div class="has-text-centered is-size-6 has-text-weight-bold is-inline-block">
					<Borders>
						<div>Loading Data</div>
						<ProgressBar value={progress} />
					</Borders>
				</div>
			</div>
			{:else}
			<div class="table-container is-flex-grow-1 is-flex is-justify-content-center">
				<table class="table is-size-7-mobile is-size-6 is-fullwidth">
					<thead>
						<tr>
							<th class="has-text-centered"><abbr title="Time">Time</abbr></th>
							<th class="has-text-centered"><abbr title="Type">Type</abbr></th>
							<th class="has-text-centered"><abbr title="Status">Status</abbr></th>
							<th class="has-text-centered"><abbr title="Energy">Kwh</abbr></th>
							<th class="has-text-centered"><abbr title="Temperature">T°</abbr></th>
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