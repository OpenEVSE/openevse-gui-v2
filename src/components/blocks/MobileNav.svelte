<script>
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import {link} from 'svelte-spa-router'
	import 'iconify-icon';
	
	export let charging
	export let selected

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

<div class="mobnav is-size-3 is-flex is-justify-content-space-evenly is-align-items-center is-flex-direction-row has-background-dark py-1">	
			<a class="nav-item" href="/monitoring" use:link class:active={selected=="/monitoring"}>
				<iconify-icon inline icon="fa6-solid:chart-simple"></iconify-icon>
			</a>
			<a class="nav-item" href="/schedule" use:link class:active={selected=="/schedule"}>
				<iconify-icon inline icon="fa6-solid:calendar-days"></iconify-icon>
			</a>
			<a href="/" use:link class="pt-2 nav-item {selected=="/"?charging?"charging":"active":""}">
				<iconify-icon class="is-size-2" inline icon="fa6-solid:bolt"></iconify-icon>
			</a>
			<a class="nav-item" href="/history" use:link class:active={selected=="/history"}>
				<iconify-icon inline icon="icon-park-outline:history-query"></iconify-icon>
			</a>
		<div class="is-flex {$uistates_store.breakpoint == "mobilemini"?"is-justify-content-right":"is-justify-content-center"}">
				<a href="/configuration" class="nav-conf" use:link class:active={selected.includes("/configuration")}>
					<iconify-icon inline icon="fa6-solid:gear"></iconify-icon>

				</a>
		</div>
</div>