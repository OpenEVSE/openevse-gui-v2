
<script>

	import TimerModal from "./TimerModal.svelte"
	import TimerTableRow from "../ui/Timer_table_row.svelte"
	import {schedule_store} from "../../lib/stores-live/schedule.js"
	import Loader from "../ui/Loader.svelte"
	import Error from "../ui/Error.svelte"
  	import { onMount } from "svelte";

	let timers_modal_opened = false;
	let timer = null;
	let fetchedSched;
	
	function editTimer(t) {
		timer = $schedule_store.findIndex(item => item.id === t);
		timers_modal_opened = true;
	}

	function addTimer() {
		timer = null;
		timers_modal_opened = true;

	}

	function refreshData() {
		fetchedSched = schedule_store.fetch()
	}

	
	onMount ( () => {
		refreshData()
		}

	);


</script>
<style>
	.timers {
		max-width : 302px;
		min-width: 300px;
		margin: auto;
	}
	.loading {
		text-align: center;
		margin: auto;
	}
</style>
<div>	
	<div class="is-size-4 has-text-weight-bold mb-3">Schedule</div>
		<div class="box timers">
			<div class="is-size-6 has-text-weight-bold mb-3">Timers</div>

					{#await fetchedSched}					
						<Loader />
					{:then}
						<table class="table is-size-6 has-text-weight-normall">
							<tfoot>
								{#if $schedule_store.length}
									{#each $schedule_store as schedule} 
										<TimerTableRow t_id={schedule.id} edit={() => {editTimer(schedule.id)}}/>
									{/each}
								{:else}
								<span class="content">Schedule is empty</span>
								{/if}
								
							</tfoot>
						</table>
					<button class="button tag is-size-6 is-info mt-3 has-tooltip-arrow has-tooltip" data-tooltip="Add a new timer"  on:click={()=>{ addTimer()}}>New</button>
					{:catch error}
					<Error title="There was an error" message={error.message} refetch={refreshData} />
					{/await}
			<TimerModal bind:timers_modal_opened={timers_modal_opened} timer={timer}/>
		</div>
</div>