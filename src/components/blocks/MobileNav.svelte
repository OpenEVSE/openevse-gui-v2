<script>
	import {Fa, FaLayers} from 'svelte-fa/src/index.js';
	import IconButton from "./../ui/IconButton.svelte"
	import {onMount, onDestroy} from 'svelte'
	import {faHome, faChartSimple, faTimeline, faCalendarDays, faGear, faBolt, faChargingStation} from '@fortawesome/free-solid-svg-icons/index.js'
	import {faCircle} from '@fortawesome/free-regular-svg-icons/index.js'
	import {push, pop, replace,location} from 'svelte-spa-router'
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
		color: rgb(202, 202, 202);
		margin-top: 3px;
	}
	.nav-item:hover {
		color: white;
		scale: 1.2;
	}
	.nav-item.active {
		color: white;
		scale: 1.2;
	}
	

</style>

<div class="mobnav is-flex is-justify-content-space-evenly is-flex-direction-row has-background-dark py-2">
		
		<div class="nav-item" class:active={selected=="/schedule"} on:click={() => { push("/schedule")}}>
			<Fa icon={faCalendarDays} size="2x"/>
		</div>
		<div class="nav-item" class:active={selected=="/monitoring"} on:click={() => { push("/monitoring")}}>
			<Fa icon={faChartSimple} size="2x" />
		</div>
		<div class="nav-item" class:active={selected=="/"} on:click={() => { push("/")}}>
			<Fa icon={faHome} size="2x" />
		</div>

		<div class="nav-item" class:active={selected=="/logs"} on:click={() => { push("/logs")}}>
			<Fa icon={faTimeline} size="2x"/>
		</div>
		<div class="nav-item" class:active={selected.includes("/configuration")} on:click={() => { push("/configuration")}}>
			<Fa icon={faGear} size="2x"/>
		</div>
</div>