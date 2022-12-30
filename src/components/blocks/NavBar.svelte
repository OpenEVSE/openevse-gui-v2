<script>
	import {link} 			  from 'svelte-spa-router'
	export let charging
	export let selected

</script>

<style>
	.mobnav {
 		/* position: fixed; */
  		/* top:	auto; */
  		/* bottom: 0; */
		width: 100%;
		height: 56px;
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



</style>

<div class="mobnav is-flex-shrink-0 is-size-3 is-flex is-justify-content-space-evenly is-align-items-center is-flex-direction-row has-background-dark py-1">	
			<a class="nav-item" href="/monitoring" use:link class:active={selected=="/monitoring"}>
				<iconify-icon inline icon="fa6-solid:chart-simple"></iconify-icon>
			</a>
			<a class="nav-item" href="/schedule" use:link class:active={selected=="/schedule"}>
				<iconify-icon inline icon="ion:calendar"></iconify-icon>
			</a>
			<a href="/" use:link class="nav-item {selected=="/"?charging?"charging":"active":""}">
				<iconify-icon inline icon="fa6-solid:bolt" height="1.2em" class="pt-2"></iconify-icon>
			</a>
			<a class="nav-item" href="/history" use:link class:active={selected=="/history"}>
				<iconify-icon inline icon="icon-park-outline:history-query"></iconify-icon>
			</a>
			<a href="/configuration" class="nav-item" use:link class:active={selected.includes("/configuration")}>
				<iconify-icon inline icon="fa6-solid:gear"></iconify-icon>
			</a>
</div>