<script>
	import Wizard from "./routes/Wizard.svelte";
	import { config_store } from "./lib/stores/config.js";
	import { status_store } from "./lib/stores/status.js";
	import { uistates_store } from './lib/stores/uistates.js'
	import "@fontsource/roboto"; // The font we are gonna serve with fontsource
	import Status from "./components/blocks/Status.svelte";
	import {location} from 'svelte-spa-router'
	import MobileNav from "./components/blocks/MobileNav.svelte"
	import DataManager from "./components/data/DataManager.svelte"
	import Router from 'svelte-spa-router'
	import { routes } from "./lib/routes.js"
	import FetchData from './components/data/FetchData.svelte'
	import {getBreakpoint} from "./lib/utils.js"
	import "./lib/icons.js"

	function getWindowSize() {
		$uistates_store.window_width = window.innerWidth
		$uistates_store.breakpoint = getBreakpoint()
	}
</script>
<style>
	.container {
		height: 100%;
	}
	main {
		height: 100%;
	}

  	:global(body) {
    font-family: "Roboto", sans-serif;
	}
  

</style>
<svelte:window on:load={getWindowSize} on:resize={getWindowSize} />
<svelte:head>
	<!-- <style src="./mystyles.scss"></style> -->
</svelte:head>

<main>		
	{#if $uistates_store.data_loaded}
		
		<div class="content">
			{#if $status_store.mode == "AP" || ($uistates_store.mode == "STA+AP" && !$config_store.ssid)}
			<div class="container px-3 pt-2 pb-6">
				<Wizard />
			</div>
			{:else}
			<div class="container px-3 pt-2 pb-6">
				{#if !$location.includes("/wizard")}
				<Status />
				{/if}

				<div>
					<Router {routes} />
				</div>
					
			</div>
			{/if}
		</div>
		{#if !$location.includes("/wizard")}
		<MobileNav charging={$uistates_store.charging} selected={$location} />
		{/if}
	<DataManager />
	{:else}
	<FetchData />
	{/if}
</main>


