<script>
	import WebSocket 			from "./components/data/WebSocket.svelte";
	import { status_store } 	from "./lib/stores/status.js";
	import { uistates_store } 	from './lib/stores/uistates.js'
	import Status 				from "./components/blocks/Status.svelte";
	import {location} 			from 'svelte-spa-router'
	import MobileNav 			from "./components/blocks/MobileNav.svelte"
	import DataManager 			from "./components/data/DataManager.svelte"
	import Router 				from 'svelte-spa-router'
	import { routes } 			from "./lib/routes.js"
	import FetchData 			from './components/data/FetchData.svelte'
	import {getBreakpoint} 		from "./lib/utils.js"
	import AlertBoxNoModal 		from "./components/ui/AlertBoxNoModal.svelte";
	import "./lib/icons.js"
	import "@fontsource/roboto";

	function getWindowSize() {
		$uistates_store.window_width = window.innerWidth
		$uistates_store.breakpoint = getBreakpoint()
		$uistates_store.box_resize = true
	}
</script>
<style>
	main {
		position: fixed;
		height: 100%;
		width: 100vw;
		overflow: hidden;
		overflow-y: hidden;
	}

  	:global(body) {
    font-family: "Roboto", sans-serif;
	}
	.status {
		/* position: fixed; */
		/* top: 0px;
		left: 0px; */
		z-index: 0;
		/* border: solid; */
	}

	.route {
		/* position: relative; */
		/* top: 10vh; */
		/* bottom: 0px; */
		width: 100%;
		height: 100%;
		z-index: 0;
		/* border: solid; */
		/* top: 220px;
		left: 0px; */
		overflow: hidden;
		overflow-x: hidden;	
		overflow-y: hidden;
		flex: 1;
	}

	.screen {
		height: 100%;
		width: 100%;
		/* overflow: hidden;
		overflow-y: hidden; */
	}
  

</style>
<svelte:window on:load={getWindowSize} on:resize={getWindowSize} />
<svelte:head>
	<!-- <style src="./mystyles.scss"></style> -->
</svelte:head>

<main>		
	{#if $uistates_store.data_loaded}
	<div class="screen is-flex is-flex-direction-column">
		{#if $status_store.evse_connected == 1}
		<div class="status is-flex is-justify-content-center mx-3 mt-1 p-0">
			<Status />
		</div>
		{/if}
		<AlertBoxNoModal title="Missing OpenEVSE module." body="OpenEVSE module is missing. Please check your setup before going further" visible={!$status_store.evse_connected} />
		<AlertBoxNoModal title="Connection error" body="Websocket  disconnected, waiting for reconnection" visible={!$uistates_store.ws_connected} />
		<div class="route">
			<Router {routes} />
		</div>
		{#if !$location.includes("/wizard")}
		<MobileNav charging={$uistates_store.charging} selected={$location} />
		{/if}
		
	</div>
	<DataManager />
	{:else}
	<FetchData />
	{/if}
	<WebSocket />
	
</main>


