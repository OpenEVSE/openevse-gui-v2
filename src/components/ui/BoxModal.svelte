<script>
	import Help 			 from "./Help.svelte";
	import { scale, fade} 	 from 'svelte/transition';
	import { expoInOut }	 from 'svelte/easing';
	

	export let title = "title"
	export let has_help = false
	export let visible = true
	export let icon = ""

</script>
<style>
	hr {
  		border-top: 1px solid rgb(50, 179, 212);
		position: relative;
		margin-top: 0px;
		margin-bottom: 0px;
	}
	.scrollable {	
		overflow: scroll;
		overflow-x: hidden;
		overflow-y: scroll;
		/* max-height: calc(100% - 45px); */
		max-height: 100%;
		height: fit-content;
	}

	.contentbox {
		/* overflow: visible	; */
		border-radius: 6px;
		color: black;
		background-color: white;
		max-height: 100%;
		max-width: 100%;
		height: 100%;
	}
</style>

<div class:is-hidden={!visible} class="contentbox p-2 has-text-centered" in:scale="{{ delay: 0, duration: 400, easing: expoInOut }}" >
	<div class:is-hidden={!has_help}>
		<Help>
		<slot name="help"></slot>
		</Help>
	</div>
	<div class="is-uppercase has-text-info is-size-5 has-text-weight-bold is-flex is-align-items-center">
		{#if icon}
		<div class="mr-1 mt-1">
				<iconify-icon class="is-size-4" icon={icon}></iconify-icon>

		</div>
		{/if}
		<span>{title}</span>
	</div>
	<div  class="mb-2"><hr></div>
	<div class="scrollable">
		<slot>
		</slot>
	</div>

</div>