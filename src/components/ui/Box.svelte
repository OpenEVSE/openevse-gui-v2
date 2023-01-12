<script>
	import { onMount } from "svelte";
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import Help 			 from "./Help.svelte"
	import { scale, fade} 	 from 'svelte/transition'
	import { expoInOut }	 from 'svelte/easing'	
	import {location} 		from 'svelte-spa-router'

	export let title = "title"
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
		/* height: 100%; */
	}
	/* .contentbox.is-full-height {
		height: 100%;
	} */
	.maincontent {	
		overflow-x:hidden; 
		overflow-y:visible; 
		/* max-height: calc(100% - 50px); */
		/* box-sizing: border-box; */
		overscroll-behavior: contain;
		/* height: 100%; */
		
	}

	.help {
		position: absolute;
		right: 5px;

	}

	.back {
		position: absolute;
		left: 5px;
		top: 10px;
	}

</style>

<div class:is-hidden={!visible} bind:this={contentbox} class="contentbox is-flex is-flex-direction-column {$uistates_store.box_is_scrollable?"is-full-height":""}" in:scale="{{ delay: 0, duration: 600, easing: expoInOut }}" >
	<div class:is-hidden={!has_help} class="help">
		<Help>
		<slot name="help"></slot>
		</Help>
	</div>
	<div class="back" class:is-hidden={!back}>
		<a href="/#/" on:click|preventDefault={()=>history.back()}>
			<iconify-icon inline class="is-size-5 m-0 p-0" icon="material-symbols:arrow-back-ios-new-rounded"></iconify-icon>
			<!-- <iconify-icon inline class="is-size-5 m-0 p-0" icon="fa6-solid:gear"></iconify-icon> -->
			<!-- <span class="has-text-weight-bold">Back</span> -->
		</a>
	</div>
	<div class="is-uppercase has-text-info is-size-5 has-text-weight-bold is-flex is-align-items-center is-justify-content-center is-flex-direction-row px-2 pt-2">

		{#if icon}
		<div class="mr-1 ">
			<iconify-icon inline class="is-size-4" icon={icon}></iconify-icon>
		</div>
		{/if}
		<span class="ml-2 is-size-5">{title}</span>
	</div>

	<div  class="mb-2 px-2"><hr></div>
	<div  class="maincontent is-flex is-flex-direction-column px-2 py-2" >
		<slot>
		</slot>
	</div>
</div>