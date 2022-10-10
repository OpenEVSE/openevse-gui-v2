<script>
	import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router';
	import { routes } from "./lib/routes.js";
	import DataPreload from './components/data/DataPreload.svelte'
</script>



<main>
	
	<Header />
	<DataPreload />
	<Router {routes}/>
</main>


