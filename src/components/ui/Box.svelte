<script>
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

	let is_scrollable = false
	let obs = new ResizeObserver(()=>checkOverflow(scrollable,contentbox))

	onMount(()=>{
		obs.observe(scrollable)
	})

	function checkOverflow(scr,cnt)
	{	
		if (scr && cnt && cnt.clientHeight && scr.scrollHeight) {
			console.log("client: " + cnt.clientHeight + " scroll: " + scr.scrollHeight)
			var isOverflowing = cnt.clientHeight < scr.scrollHeight
			console.log(isOverflowing)
			is_scrollable = isOverflowing
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
		/* height: 100%; */

		
	}
	.contentbox.is-full-height {
		height: 100%;
	}
	.contentbox:not(.is-full-height) {
		/* position: relative; */
		/* min-height: 70%; */
		/* top: 50%;

		-webkit-transform: translate(0, -50%);
		-ms-transform: translate(0, -50%);
		transform: translate(0, -50%); */
	}
	.maincontent {	
		overflow-x:hidden; 
		overflow-y:auto; 
		max-height: calc(100% - 42px);
		/* box-sizing: border-box; */
		/* height: 100%; */
		overscroll-behavior: contain;
	}
	.scrollable {
		/* overflow: hidden;  */
	}
</style>

<div class:is-hidden={!visible} bind:this={contentbox} class="contentbox p-2 {is_scrollable?"is-full-height":""}" in:scale="{{ delay: 0, duration: 400, easing: expoInOut }}">
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
	<div class="maincontent" >
		<div class="scrollable" bind:this={scrollable} >
			<slot>
			</slot>
		</div>
	</div>

</div>