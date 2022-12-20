<script>
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import { onMount } from "svelte"
	import Help 			 from "./Help.svelte"
	import { scale, fade} 	 from 'svelte/transition'
	import { expoInOut }	 from 'svelte/easing'
	import 'iconify-icon'

	export let title = "title"
	export let has_help = false
	export let visible = true
	export let icon = ""

	let scrollable
	let contentbox
	let clientHeight
	let scrollHeight

	let is_scrollable = false
	let obs = new ResizeObserver(()=>checkOverflow(scrollable,contentbox))

	onMount(()=>{
		obs.observe(scrollable)
	})

	function checkOverflow(scr,cnt)
	{	
		if (scr && cnt && (clientHeight != cnt.clientHeight || scrollHeight != scr.scrollHeight)) {
			clientHeight =  cnt.clientHeight
			scrollHeight = scr.scrollHeight
			console.log("client: " + clientHeight + " scroll: " + scrollHeight)
			var isOverflowing = clientHeight < scrollHeight
			console.log(isOverflowing)
			$uistates_store.box_is_scrollable = isOverflowing
		}
	}

</script>
<style>
	hr {
  		border-top: 1px solid rgb(50, 179, 212);
		position: relative;
		margin-top: 0px;
		margin-bottom: 0px;
	}
	.contentbox {
		/* overflow: hidden; */
		border-radius: 6px;
		color: black;
		background-color: white;
		max-height: calc(100% + 5px);
		min-height: 50%;
		position: relative;
		
	}
	.contentbox.is-full-height {
		height: 100%;
	}
	.contentbox:not(.is-full-height) {
		/* position: relative; */
		/* min-height: 70%; */
	}
	.maincontent {	
		overflow-x:hidden; 
		overflow-y:auto; 
		max-height: calc(100% - 42px);
		/* box-sizing: border-box; */
		/* height: 100%; */
	}

</style>

<div class:is-hidden={!visible} bind:this={contentbox} class="contentbox p-2  {$uistates_store.box_is_scrollable?"is-full-height":""}" in:scale="{{ delay: 0, duration: 400, easing: expoInOut }}" >
	<div class:is-hidden={!has_help} class="is-pulled-right">
		<Help>
		<slot name="help"></slot>
		</Help>
	</div>
	<div class="is-uppercase has-text-info is-size-5 has-text-weight-bold is-flex is-align-items-center is-flex-direction-row">
	
		{#if icon}
		<div class="mr-1 ">
				<iconify-icon class="is-size-4" icon={icon}></iconify-icon>

		</div>
		{/if}
		<span>{title}</span>
	</div>
	<div  class="mb-2"><hr></div>
	<div class="is-flex is-align-items-center is-justify-content-center">
		<div class="maincontent">
			<div  class="" bind:this={scrollable} >
				<slot>
				</slot>
			</div>
		</div>
	</div>


</div>