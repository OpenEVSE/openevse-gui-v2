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


	let obs = new ResizeObserver(()=>checkOverflow(scrollable,contentbox))

	onMount(()=>{
		obs.observe(scrollable)
	})

	function handleResize() {
		if ($uistates_store.box_resize) {
			checkOverflow(scrollable,contentbox)
			$uistates_store.box_resize = false;
		}
    }

	function checkOverflow(scr,cnt)
	{	
		if (scr && cnt && (clientHeight != cnt.clientHeight || scrollHeight != scr.scrollHeight)) {
			clientHeight =  cnt.clientHeight - 40
			scrollHeight = scr.scrollHeight
			console.log("client: " + clientHeight + " scroll: " + scrollHeight)
			var isOverflowing = clientHeight < scrollHeight
			console.log(isOverflowing)
			$uistates_store.box_is_scrollable = isOverflowing
		}
	}

	$: $uistates_store.box_resize, handleResize()

</script>
<style>
	hr {
  		border-top: 1px solid rgb(50, 179, 212);
		position: relative;
		margin-top: 0px;
		margin-bottom: 0px;
	}
	.contentbox {
		overflow: visible;
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
	.contentbox:not(.is-full-height) {
		/* position: relative; */
		/* min-height: 70%; */
	}
	.maincontent {	
		overflow-x:hidden; 
		/* overflow-y:visible;  */
		max-height: calc(100% - 42px);
		/* box-sizing: border-box; */
		/* height: 100%; */
		overscroll-behavior: contain;
	}

</style>

<div class:is-hidden={!visible} bind:this={contentbox} class="contentbox p-3  {$uistates_store.box_is_scrollable?"is-full-height":""}" in:scale="{{ delay: 0, duration: 400, easing: expoInOut }}" >
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
	<!-- <div class="maincontent"  > -->
	<div  class="maincontent" bind:this={scrollable} >
		<slot>
		</slot>
	</div>
	<!-- </div> -->


</div>