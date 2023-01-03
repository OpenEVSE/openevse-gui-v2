<script>
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import Help 			 from "./Help.svelte"
	import { scale, fade} 	 from 'svelte/transition'
	import { expoInOut }	 from 'svelte/easing'	

	export let title = "title"
	export let has_help = false
	export let visible = true
	export let icon = ""
	let contentbox


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
		overflow: hidden;
		border-radius: 6px;
		color: black;
		background-color: white;
		max-height: calc(100% + 5px);
		min-height: 50%;
		/* height: 100%; */
	}
	.contentbox.is-full-height {
		height: 100%;
	}
	.maincontent {	
		overflow-x:hidden; 
		overflow-y:scroll; 
		max-height: calc(100% - 50px);
		/* box-sizing: border-box; */
		overscroll-behavior: contain;
		/* height: 100%; */
		
	}

	.help {
		position: absolute;
		right: 5px;

	}

</style>

<div class:is-hidden={!visible} bind:this={contentbox} class="contentbox is-flex is-flex-direction-column {$uistates_store.box_is_scrollable?"is-full-height":""}" in:scale="{{ delay: 0, duration: 600, easing: expoInOut }}" >
	<div class:is-hidden={!has_help} class="help">
		<Help>
		<slot name="help"></slot>
		</Help>
	</div>
	<div class="is-uppercase has-text-info is-size-5 has-text-weight-bold is-flex is-align-items-center is-flex-direction-row px-2 pt-2">
	
		{#if icon}
		<div class="mr-1 ">
				<iconify-icon class="is-size-4" icon={icon}></iconify-icon>
		</div>
		{/if}
		<span>{title}</span>
	</div>

	<div  class="mb-2 px-2"><hr></div>
	<div  class="maincontent is-flex-grow-1 is-flex is-flex-direction-column px-2" >
		<slot>
		</slot>
	</div>
</div>