<script>
	import AlertBox 			from "./components/ui/AlertBox.svelte";
	import WebSocket 			from "./components/data/WebSocket.svelte";
	import { status_store } 	from "./lib/stores/status.js";
	import { uistates_store } 	from './lib/stores/uistates.js'
	import Status 				from "./components/blocks/Status.svelte";
	import {location} 			from 'svelte-spa-router'
	import NavBar 				from "./components/blocks/NavBar.svelte"
	import DataManager 			from "./components/data/DataManager.svelte"
	import Router 				from 'svelte-spa-router'
	import { routes } 			from "./lib/routes.js"
	import FetchData 			from './components/data/FetchData.svelte'
	import {getBreakpoint} 		from "./lib/utils.js"
	import AlertBoxNoModal 		from "./components/ui/AlertBoxNoModal.svelte"
	import { _ } 				from 'svelte-i18n'
	import "./lib/i18n.js"
	import 'iconify-icon'
	// import "./lib/icons.js"
	import "@fontsource/roboto"

	import("./lib/icons.js")
	

	let islandscape = false

	function getWindowSize() {
		$uistates_store.window_width = window.innerWidth
		$uistates_store.breakpoint = getBreakpoint()
		$uistates_store.box_resize = true
	}

</script>
<style>
	main {
		/* position: fixed; */
		height: 100%;
		width: 100vw;
		overflow: hidden;
	}

  	:global(body) {
    font-family: "Roboto", sans-serif;
	}

	.status {
		z-index: 1;
	}

	.route {
		width: 100%;
		height: 100%;
		z-index: 0;
		overflow: hidden;
		overflow-x: hidden;	
		overflow-y: overlay;
		flex: 1;
	}

	.screen {
		overflow-y: hidden;
		height: calc(100vh - 56px);
		width: 100%;
	}

	.nav {
		position: fixed;
		z-index: 0;
		bottom: 0;
		width: 100%;
		height: 56px;
	}
  

</style>
<svelte:window on:load={getWindowSize} on:resize={getWindowSize}/>
<svelte:head>
	<!-- <style src="./mystyles.scss"></style> -->
</svelte:head>

<main>		
	{#if $uistates_store.data_loaded}
	<div class="screen">

		<div class="route">
			{#if $status_store.evse_connected == 1}
			<div class="status is-flex is-justify-content-center is-flex-shrink-0 mx-3 mt-1 p-0">
				<Status />
			</div>
			{/if}
			<AlertBoxNoModal title={$_("alert-evsemissing-title")} body={$_("alert-evsemissing-body")} visible={!$status_store.evse_connected} />
			<AlertBoxNoModal title={$_("alert-conerror-title")} body={$_("alert-conerror-body")} visible={!$uistates_store.ws_connected} />
			<AlertBox title={$_("alert-portrait-title")} body={$_("alert-portrait-body")} visible={islandscape} closable={false} />
			<Router {routes} />
		</div>
	</div>
	{#if !$location.includes("/wizard")}
	<div class="nav">
		<NavBar charging={$uistates_store.charging} selected={$location} />
	</div>
	
	{/if}
	<DataManager />
	<WebSocket />
	{:else}
	<FetchData />
	{/if}
</main>

