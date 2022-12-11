<script>
	import DataManager from "./../../data/DataManager.svelte";
	import Loader from "./../../ui/Loader.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import { uistates_store } from "./../../../lib/stores/uistates.js";
	import Box from "./../../ui/Box.svelte"
	import { history_store } from "./../../../lib/stores/history.js"
	import { onMount } from "svelte"
	import {httpAPI, formatDate, round, state2icon, type2icon} from "../../../lib/utils.js"
	import { serialQueue } from "./../../../lib/queue.js";
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner} from '@fortawesome/free-solid-svg-icons/index.js'

	let index
	let loaded = false
	async function init() {
		index = await serialQueue.add(() => httpAPI("GET","/logs"))
		if ($uistates_store.logidx_min != index.min || $uistates_store.logidx_max != index.max) {
			loaded = false
			//refresh data
			$uistates_store.logidx_min = index.min
			$uistates_store.logidx_max = index.max
			//reset history
			$history_store = ""
			for (let i = index.min; i <= index.max; i++) {
				await serialQueue.add(() => history_store.download(i))
			}
			loaded = true
		}
		else {
			await serialQueue.add(() => history_store.download(index.max))
			loaded = true
		}
		
	}

	onMount(()=>{
		init()

	})

</script>

<Box title="History">
		<div class="has-text-centered">
			{#if !loaded}
			<div class="box is-inline-block has-text-centered mt-4 mb-5 is-size-6 has-text-weight-bold">
				<div class="mb-4">Loading Data</div>
				<Fa class="has-text-info is-size-4" icon={faSpinner} spin />
			</div>
				
			{:else}
			<table class="table is-size-7">
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
							<Fa size={"1x"} class={item.type=="warning"?"has-text-danger":"has-text-info"} icon={type2icon(item.type)}/>
						</td>
						<td class="has-tooltip" data-tooltip={state2icon(item.evseState).tooltip}>
							<Fa size={"1x"} class={state2icon(item.evseState).color} icon={state2icon(item.evseState).type}/>
						</td>
						<td>{round(item.energy/1000,1)}</td>
						<td>{item.temperature}</td>
					</tr>
					{/each}
				</tbody>
			</table>
			{/if}
		</div>
	
</Box>