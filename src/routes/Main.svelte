<script>
	import Status from "../components/blocks/Status.svelte"
	import Manual from "../components/blocks/Manual.svelte"
	import Timers from "../components/blocks/Timers.svelte"
</script>
<div class="container px-3">
	<Status />
	<div class="is-flex is-flex-wrap-wrap is-align-items-self-start is-justify-content-center">
		<!-- <TabMain /> -->
		<Manual />
		<Timers />
	</div>
</div>