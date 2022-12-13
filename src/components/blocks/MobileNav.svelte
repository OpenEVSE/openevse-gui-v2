<script>
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import Fa from 'svelte-fa/src/index.js';
	import {faChartSimple, faTimeline, faCalendarDays, faGear, faBolt} from '@fortawesome/free-solid-svg-icons/index.js'
	import {push, link} from 'svelte-spa-router'
	import Icon from '@iconify/svelte';
	
	export let charging
	export let selected
	let submenu_visible = false

</script>

<style>
	.mobnav {
 		position: fixed;
  		top:	auto;
  		bottom: 0;
		width: 100%;
	}
	.nav-item {
		/* color: rgb(202, 202, 202); */
		margin-top: 3px;
	}
	.nav-item:hover {
		color: white;
		scale: 1.2;
	}
	.nav-item.active {
		color: white;
		pointer-events: none;
  		cursor: default;
  		text-decoration: none;
	}
	.nav-item.charging {
		color: hsl(57, 93%, 48%);;
	}

	.nav-conf {
		color: hsl(189, 53%, 47%);
		border: 0;
		background-color: hsl(195, 78%, 30%);
	}
	.nav-conf:hover {
		color: white;
		scale: 1.2;
	}
	.nav-conf.active {
		color: white;
	}

	

</style>

<div class="mobnav is-flex is-justify-content-space-evenly is-align-items-center is-flex-direction-row has-background-dark py-1">	
			<a class="nav-item" href="/monitoring" use:link class:active={selected=="/monitoring"}>
				<Icon class="mt-1" icon="fa6-solid:chart-simple" width=30/>
			</a>
			<a class="nav-item" href="/schedule" use:link class:active={selected=="/schedule"}>
				<Icon class="mt-1" icon="fa6-solid:calendar-days" width=30/>
			</a>
			<a href="/" use:link class="nav-item {selected=="/"?charging?"charging":"active":""}">
				<Icon class="mt-1 mb-0" icon="fa6-solid:bolt" width=35/>
			</a>
			<a class="nav-item" href="/history" use:link class:active={selected=="/istory"}>
				<Icon class="mt-1" icon="icon-park-outline:history-query" width=40/>
			</a>
		<div class="is-flex {$uistates_store.breakpoint == "mobilemini"?"is-justify-content-right":"is-justify-content-center"}">
				<a href="/configuration" class="nav-conf" use:link class:active={selected.includes("/configuration")}>
					<Icon class="mt-1" icon="fa6-solid:gear" width=30/>

				</a>
		</div>
</div>