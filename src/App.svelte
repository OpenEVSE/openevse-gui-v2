<script>
	import DataManager from "./components/data/DataManager.svelte";
	import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router';
	import { routes } from "./lib/routes.js";
	import FetchData from './components/data/FetchData.svelte'
	import {uistates_store} from './lib/stores/uistates.js'
	import {getBreakpoint} from "./lib/utils.js"


	function getWindowSize() {
		$uistates_store.window_width = window.innerWidth;
		$uistates_store.breakpoint = getBreakpoint()
	}
	document.body.classList.add('hideScroll')
</script>
<style>

</style>
<svelte:window on:load={getWindowSize} on:resize={getWindowSize}/>

<svelte:head>
<style>
	/*Hide scrollbars*/
	body::-webkit-scrollbar { display: none; }
	body {
	-ms-overflow-style: none;  /* IE and Edge */
	scrollbar-width: none;     /* Firefox */
	}
</style>
</svelte:head>	

<main>		
	<Header />
	<FetchData />
	{#if $uistates_store.data_loaded}
	<DataManager />
	<Router {routes} />
	{/if}
</main>


