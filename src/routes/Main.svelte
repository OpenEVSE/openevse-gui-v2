<script>
	import Status from "../components/blocks/Status.svelte"
	import Manual from "../components/blocks/Manual.svelte"
	import TabMain from "../components/ui/TabMain.svelte"
	import Timers from "../components/blocks/Timers.svelte"
</script>
<div class="container px-3">
	<Status />
	<div class="is-flex is-flex-wrap-wrap is-justify-content-space-evenly is-align-items-flex-start ">
		<!-- <TabMain /> -->
		<Manual />
		<Timers />
	</div>
</div>