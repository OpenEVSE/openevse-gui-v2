<script>
	import Status from "../components/blocks/Status.svelte"
	import Manual from "../components/blocks/main/Manual.svelte"
	import Timers from "../components/blocks/main/Timers.svelte"
	import Breadcrumb from "../components/ui/Breadcrumb.svelte"
</script>
<div class="container px-3">
	<Status />
	<Breadcrumb />
	<div class="columns">
		<div class="column">
			<Manual />
		</div>
		<div class="column">
			<Timers />
		</div>
	</div>
</div>