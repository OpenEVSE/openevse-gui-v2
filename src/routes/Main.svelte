<script>
	import Status from "../components/blocks/Status.svelte"
	import Manual from "../components/blocks/Manual.svelte"
	import Timers from "../components/blocks/Timers.svelte"
	import TabMain from "../components/ui/TabMain.svelte"
	import {location} from 'svelte-spa-router'
</script>
<div class="container px-3">
	<Status />
	<div class="container">
		<TabMain />
		{#if $location == "/"}
		<Manual />
		{:else if $location == "/schedule"}
		<Timers />
		{/if}
	</div>
</div>