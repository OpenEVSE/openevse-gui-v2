<script>
	import { onMount } from "svelte";
	import {schedule_store} from "../../lib/stores/schedule.js"
	let fetched
	let status = "Loading"

	async function loadData() {
		status = "Fetching Schedule"
		fetched = schedule_store.fetch()
		status = await fetched?"Fetched Schedule":""
		
	}

	
	onMount ( () => {
		loadData()
		}
	);

</script>

{#await fetched}
<div class="pageloader is-active" ><span class="title">{status}</span></div>
{/await}