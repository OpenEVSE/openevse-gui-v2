<script>
	import Status from "../components/blocks/Status.svelte"
	import Manual from "../components/blocks/Manual.svelte"
	import Timers from "../components/blocks/Timers.svelte"
</script>
<div class="container px-3">
	<Status />
	<div class="columns">
		<div class="column">
			<Manual />
		</div>
		<div class="column">
			<Timers />
		</div>
	</div>
</div>