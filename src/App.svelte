<script>
	import { onMount } from "svelte";
	import AlertBox 			from "./components/ui/AlertBox.svelte"
	import WebSocket 			from "./components/data/WebSocket.svelte"
	import { status_store } 	from "./lib/stores/status.js"
	import { uistates_store } 	from './lib/stores/uistates.js'
	import Status 				from "./components/blocks/Status.svelte"
	import {location} 			from 'svelte-spa-router'
	import NavBar 				from "./components/blocks/NavBar.svelte"
	import DataManager 			from "./components/data/DataManager.svelte"
	import Router 				from 'svelte-spa-router'
	import {replace}			from 'svelte-spa-router'
	import { routes } 			from "./lib/routes.js"
	import FetchData 			from './components/data/FetchData.svelte'
	import {getBreakpoint,
			getStateDesc} 		from "./lib/utils.js"
	import AlertBoxNoModal 		from "./components/ui/AlertBoxNoModal.svelte"
	import { _ , locale } 		from 'svelte-i18n'
	import "./lib/i18n.js"
	import 'iconify-icon'
	// import "@fontsource/roboto"

	import("./lib/icons/icons.js")

	function getWindowSize() {
		$uistates_store.breakpoint = getBreakpoint()
	}

</script>
<style>
	main {
		/* position: fixed; */
		height: 100%;
		width: 100vw;
		overflow: hidden;
		overflow-y: hidden;
	}

  	:global(*) {
    font-family: "Roboto", "Arial", sans-serif ;
	}

	.status {
		z-index: 1;
	}

	.route {
		position: absolute;
		width: 100%;
		z-index: 1;
		bottom: 56px;	
		overflow: hidden;
		overflow-x: hidden;	
		overflow-y: scroll;
		/* flex: 1; */
		height: calc( 100% - 56px );
	}
	.route.wizard {
		height: 100%;
		bottom: 0px;
	}

	.nav {
		position: fixed;
		overflow: hidden;
		z-index: 0;
		bottom: 0;
		width: 100%;
		height: 56px;
	}
  

</style>
<svelte:window on:load={getWindowSize} on:resize={getWindowSize}/>
<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
	</style>
</svelte:head>	
<svelte:body lang={$locale} class="notranslate" translate="no" /> 
<main>		
	{#if $uistates_store.data_loaded}

		<div class="route" class:wizard={$location.includes("/wizard")}>
			{#if $status_store?.evse_connected && !$location.includes("/wizard")}
			<div class="status mx-3 mt-1 p-0">
				<Status />
			</div>
			{/if}
			{#if !$status_store.evse_connected}
			<AlertBoxNoModal title={$_("alert-evsemissing-title")} body={$_("alert-evsemissing-body")} visible={true} />
			{/if}
			{#if !$uistates_store.ws_connected}
			<AlertBoxNoModal title={$_("alert-conerror-title")} body={$_("alert-conerror-body")} visible={true} />
			{/if}
			{#if $uistates_store.error}
			<AlertBoxNoModal title={$_("alert-error")} body={getStateDesc($status_store.state)} visible={true} /> 
			{/if}
			<Router {routes} />
		</div>
    
	
	{#if !$location.includes("/wizard")}
	<div class="nav">
		<NavBar charging={$uistates_store.charging} selected={$location} />
	</div>
	
	{/if}
	<DataManager />
	<WebSocket />
	<AlertBox 
		title={$uistates_store?.alertbox.title} 
		bind:visible={$uistates_store.alertbox.visible} 
		closable={$uistates_store?.alertbox.closable} 
		button={$uistates_store?.alertbox.button} 
		body={$uistates_store?.alertbox.body}
		component={$uistates_store?.alertbox.component}
		action={$uistates_store?.alertbox.action}
	/>
	{:else}
	<FetchData />
	{/if}

</main>

