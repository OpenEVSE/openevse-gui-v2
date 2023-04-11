<script>
	import { _ } 		   		from 'svelte-i18n'
	import { onMount } 			from "svelte";
	import Help 			 	from "./Help.svelte"
	// import { scale} 	 	from 'svelte/transition'
	// import { expoInOut }	 	from 'svelte/easing'	
	import {location} 			from 'svelte-spa-router'

	export let title = null
	export let has_help = false
	export let visible = true
	export let icon = ""
	export let back = false
	let contentbox
	
	onMount(()=> {
		back = $location.includes("/wizard")?false:back
	})

	
</script>
<style>
	hr {
  		border-top: 1px solid rgb(50, 179, 212);
		position: relative;
		margin-top: 0px;
		margin-bottom: 0px;
	}
	.contentbox {
		position: relative;
		/* overflow: hidden; */
		border-radius: 6px;
		color: black;
		background-color: white;
		/* max-height: calc(100% + 5px); */
		min-height: 50%;
		height: fit-content; 
	}
	/* .contentbox.is-full-height {
		height: 100%;
	} */
	.maincontent {	
		/* overflow-x:hidden; 
		overflow-y:hidden;  */
		/* max-height: calc(100% - 50px); */
		/* box-sizing: border-box; */
		overscroll-behavior: contain;
		
	}

	.help {
		position: absolute;
		right: 7px;
		top: 8px;

	}

	.back {
		position: absolute;
		left: 7px;
		top: 6px;

	}

	.back:hover {
		transform: scale(1.2);
	}

</style>
<div class:is-hidden={!visible} bind:this={contentbox} class="contentbox is-flex is-flex-direction-column" >
<!-- <div class:is-hidden={!visible} bind:this={contentbox} class="	contentbox is-flex is-flex-direction-column" in:scale="{{ delay: 0, duration: 600, easing: expoInOut }}" > -->
	<div class="is-flex is-align-items-center">
		<div class:is-hidden={!has_help} class="help m-0 p-0">
			<Help>
			<slot name="help"></slot>
			</Help>
		</div>
		<div class="back m-0 p-0" class:is-hidden={!back}>
			<a href="/#/" class="has-text-info" on:click|preventDefault={()=>history.back()}>
				<iconify-icon inline class="is-size-4 m-0 p-0" icon="mdi:arrow-back-circle"></iconify-icon>
			</a>
		</div>
	</div>
	{#if title}
	<div class="is-uppercase has-text-dark is-size-5 has-text-weight-bold is-flex is-align-items-center is-justify-content-center is-flex-direction-row px-2 py-1">

		{#if icon}
		<div class="mr-1 ">
			<iconify-icon inline icon={icon}></iconify-icon>
		</div>
		{/if}
		<span class="ml-2 is-size-5">{title}</span>
	</div>
	{/if}

	<div  class="px-2"><hr></div>
	<div  class="maincontent is-flex is-flex-direction-column px-2 py-2" >
		<slot>
		</slot>
	</div>
</div>