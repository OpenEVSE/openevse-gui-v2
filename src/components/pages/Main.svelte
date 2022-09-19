<script>
	import Status from "../blocks/Status.svelte"
	import Manual from "../blocks//Manual.svelte"
	import Timers from "../blocks//Timers.svelte"
</script>
<div class="container px-3">
	<Status />
	<div class="container">
		<div class="columns" >
			<div class="column">
				<Manual />
			</div>
			<div class="column">
				<Timers />
			</div>
		</div>
	</div>
</div>