<script>
	// @ts-ignore
	import {location} from 'svelte-spa-router'
	import MobileNav from "./components/blocks/MobileNav.svelte"
	import {onMount, onDestroy} from "svelte"
	import DataManager from "./components/data/DataManager.svelte"
	// import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router'
	import { routes } from "./lib/routes.js"
	import FetchData from './components/data/FetchData.svelte'
	import {uistates_store} from './lib/stores/uistates.js'
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
	<style>
		/*Hide scrollbars*/
		body::-webkit-scrollbar { display: none; }

		body {
			-ms-overflow-style: none;  /* IE and Edge */
			scrollbar-width: none;     /* Firefox */
			overflow: auto;
		}

		html {
			background-color: #38a4b6;
		}

		.content {
			overflow-y:auto;
			padding-bottom: 30px;
		}

	</style>
</svelte:head>
<svelte:body class="has-background-dark" />
<main>		
	<!-- <Header /> -->
	{#if $uistates_store.data_loaded}
	<div class="content">
		<Router {routes} />
	</div>
	<MobileNav selected={$location}/>
	<DataManager />
	{:else}
	<FetchData />
	{/if}
</main>


