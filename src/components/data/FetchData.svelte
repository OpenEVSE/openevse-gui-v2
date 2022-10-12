<script>
	import { onMount } from "svelte"
	import {schedule_store} from "../../lib/stores/schedule.js"
	import {status_store} from "../../lib/stores/status.js"
	import {plan_store} from "../../lib/stores/plan.js"

	let status = "Loading"

	async function loadData() {
		status = "Fetching Schedule"
		await schedule_store.download()
		status = "Fetching Status"
		await status_store.download()
		status = "Fetch Schedule Plan"
		await plan_store.download()
		status = "Ok"
	}

	$: console.log(status)
	
	onMount ( () => {
		loadData()
		}
	);

</script>

<div class="pageloader {status!="Ok"?"is-active":""}"><span class="title">{status}</span></div>
