<script>
	import "@fontsource/roboto"; // The font we are gonna serve with fontsource
	import Status from "./components/blocks/Status.svelte";
	import {location} from 'svelte-spa-router'
		// @ts-ignore
	import MobileNav from "./components/blocks/MobileNav.svelte"
	import {onMount, onDestroy} from "svelte"
	import DataManager from "./components/data/DataManager.svelte"
	// import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router'
	import { routes } from "./lib/routes.js"
	import FetchData from './components/data/FetchData.svelte'
	import { uistates_store } from './lib/stores/uistates.js'
	import {getBreakpoint} from "./lib/utils.js"

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
		<div class="container px-3 pt-2 pb-6">
			<Status />
			<div>
				<Router {routes} />
			</div>
				
		</div>
	</div>
	<MobileNav charging={$uistates_store.charging} selected={$location} />
	<DataManager />
	{:else}
	<FetchData />
	{/if}
</main>


