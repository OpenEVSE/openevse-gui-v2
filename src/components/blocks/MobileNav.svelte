<script>
	import NavSubmenu from "./../ui/NavSubmenu.svelte";
	import Fa from 'svelte-fa/src/index.js';
	import {faChartSimple, faTimeline, faCalendarDays, faGear, faBolt} from '@fortawesome/free-solid-svg-icons/index.js'
	import {push, link} from 'svelte-spa-router'
	
	export let charging
	export let selected
	let submenu_visible = false

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
		scale: 1.2;
	}
	.nav-item.charging {
		color: hsl(57, 93%, 48%);;
		scale: 1.2;
	}

	.nav-conf {
		color: white;
		border: 0;
	}
	.nav-conf:hover {
		color: white;
		scale: 1.2;
	}

	

</style>

<div class="mobnav is-flex is-justify-content-space-evenly is-align-items-center is-flex-direction-row has-background-dark py-2">
		

		<div>		
			<a class="nav-item" href="/monitoring" use:link class:active={selected=="/monitoring"} >
				<Fa icon={faChartSimple} size="2x" />
			</a>

		</div>
		<div>
			<a class="nav-item" href="/schedule" use:link class:active={selected=="/schedule"} >
				<Fa icon={faCalendarDays} size="2x"/>
			</a>
		</div>
		<div>
			<a href="/" use:link class="nav-item {selected=="/"?charging?"charging":"active":""}" >
				<Fa icon={faBolt} size="2.5x" />
			</a>
		</div>
		<div>
			<a class="nav-item" href="/history" use:link class:active={selected=="/history"} >
				<Fa icon={faTimeline} size="2x"/>
			</a>
		</div>
		<div class="is-flex is-justify-content-end">
			<button class="nav-conf has-background-dark" on:click|preventDefault={toggleSubMenu} class:active={selected.includes("/configuration")} >
				<Fa icon={faGear} size="2x"/>
			</button>
			<NavSubmenu bind:isvisible={submenu_visible} />
		</div>
</div>