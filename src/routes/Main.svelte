<script>
	import Status from "../components/blocks/Status.svelte"
	import Manual from "../components/blocks/Manual.svelte"
	import Timers from "../components/blocks/Timers.svelte"
</script>
<div class="container px-3">
	<Status />
	<div class="columns is-vcentered is-mobile is-multiline is-centered">
		<div class="column is-narrow-mobile is-half-desktop">
			<Manual />
		</div>
		<div class="column is-narrow-mobile is-half-desktop">
			<Timers />
		</div>
	</div>
</div>