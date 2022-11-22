<script>
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
	import { status_store } from "./lib/stores/status.js";
	import {getBreakpoint} from "./lib/utils.js"

	function getWindowSize() {
		$uistates_store.window_width = window.innerWidth
		$uistates_store.breakpoint = getBreakpoint()
	}
	
	document.body.classList.add('hideScroll')


</script>
<svelte:window on:load={getWindowSize} on:resize={getWindowSize} />
<svelte:head>
	<style src="./mystyles.scss"></style>
</svelte:head>

<main>		
	<!-- <Header /> -->
	{#if $uistates_store.data_loaded}
	<div class="content">
		<Router {routes} />
	</div>
	<MobileNav charging={$uistates_store.charging} selected={$location} />
	<DataManager />
	{:else}
	<FetchData />
	{/if}
</main>


