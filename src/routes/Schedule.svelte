<script>
	import Status from "../components/blocks/Status.svelte"
	import Timers from "../components/blocks/Timers.svelte"
	import TabMain from "../components/ui/TabMain.svelte"
	import {location} from 'svelte-spa-router'
</script>
<div class="container px-3">
	<Status />
	<div class="box">
		<TabMain />
		<Timers />
	</div>
</div>