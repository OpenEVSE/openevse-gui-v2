<script>
	import NavSubmenu from "./../ui/NavSubmenu.svelte";
	import Fa from 'svelte-fa/src/index.js';
	import {faChartSimple, faTimeline, faCalendarDays, faGear, faBolt} from '@fortawesome/free-solid-svg-icons/index.js'
	import {push, link} from 'svelte-spa-router'
	
	export let charging
	export let selected
	let submenu_visible = false

	function hideSubMenu() {
		submenu_visible = false
	}
	
	function showSubMenu() {
		submenu_visible = true
	}

	function toggleSubMenu() {
		submenu_visible = !submenu_visible
	}
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

<div class="mobnav is-flex is-justify-content-space-evenly is-align-items-center is-flex-direction-row has-background-dark py-2">	
			<a class="nav-item" href="/monitoring" use:link class:active={selected=="/monitoring"} >
				<Fa icon={faChartSimple} size="2x" />
			</a>
			<a class="nav-item" href="/schedule" use:link class:active={selected=="/schedule"} >
				<Fa icon={faCalendarDays} size="2x"/>
			</a>
			<a href="/" use:link class="nav-item {selected=="/"?charging?"charging":"active":""}" >
				<Fa icon={faBolt} size="2.5x" />
			</a>
			<a class="nav-item" href="/history" use:link class:active={selected=="/history"} >
				<Fa icon={faTimeline} size="2x"/>
			</a>
		<div class="is-flex is-justify-content-end">
				<a href="/configuration" class="nav-conf" class:active={selected.includes("/configuration")} on:click|preventDefault={toggleSubMenu}>
					<Fa icon={faGear} size="2x" />
				</a>
			<NavSubmenu bind:isvisible={submenu_visible} />
		</div>
</div>