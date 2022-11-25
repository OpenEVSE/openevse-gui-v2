<script>
	import {link} from 'svelte-spa-router'
	export let isvisible
	export let selected
	function close() {
		isvisible = false;
	}

	$: selected, console.log("selected: " + selected)
</script>
<style>
	.nav-submenu {
		position: absolute;
		bottom: 60px;
		/* width: 150px; */
		/* height: 100px; */
		/* border: 3px solid #73AD21;   */
	}

	.button {
		width: 120px;
		color: hsl(189, 53%, 47%);
	}
	.button.active {
		color: white;
	}
	
</style>
<div class="nav-submenu">
	<div class="is-flex is-flex-direction-column-reverse" class:is-hidden={!isvisible} on:mouseout={close} on:blur={close}>
		<a href="/configuration/services" on:click={close} use:link><div class="my-1 pr-5 is-inline-block button is-dark"  class:active={selected=="/configuration/services"}>Services</div></a>
		<a href="/configuration/hardware" on:click={close} use:link><div class="mt-1 is-inline-block button is-dark" class:active={selected=="/configuration/hardware"}>Hardware</div></a>
		<a href="/configuration/system" on:click={close} use:link><div class="mt-1 is-inline-block button is-dark" class:active={selected=="/configuration/system"}>System</div></a>		
	</div>
</div>