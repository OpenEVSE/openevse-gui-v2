<script>
	import {link} from 'svelte-spa-router'
	export let isvisible
	function close() {
		isvisible = false;
	}
</script>
<style>
	.nav-submenu {
			position: absolute;
		z-index: 2;
		bottom: 62px;
		/* width: 150px; */
		/* height: 100px; */
		/* border: 3px solid #73AD21; */
	}
	.button {
		width: 120px;
	}
</style>
<div class="nav-submenu">
	<div class="is-flex is-flex-direction-column" class:is-hidden={!isvisible}>
		<a href="/configuration/system" on:click={close} use:link><div class="is-inline-block button is-dark  ">System</div></a>
		<a href="/configuration/hardware" on:click={close} use:link><div class="mt-1 is-inline-block button is-dark ">Hardware</div></a>
		<a href="/configuration/services" on:click={close} use:link><div class="mt-1 is-inline-block button is-dark ">Services</div></a>

	</div>
</div>