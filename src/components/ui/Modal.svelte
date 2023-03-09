<script>
	import {onMount, onDestroy} from "svelte"
	export let is_opened = false
	export let canClose = true
	export let fit = false

	onMount (disablescroll)
	onDestroy (enablescroll)

	function scrollEventListener() {
		// if scroll happens, set it to the previous value
		const TopScroll = window.pageYOffset || document.documentElement.scrollTop
		const LeftScroll = window.pageXOffset || document.documentElement.scrollLeft
		window.scrollTo(LeftScroll, TopScroll)
	}
	function disablescroll() {
		document.addEventListener(
			'scroll',
			scrollEventListener, 
			{ passive: true }
		);
	}

	function enablescroll() {
		// @ts-ignore
		document.removeEventListener('scroll', scrollEventListener, { passive: true } )
		window.onscroll = function() {};
	}

	function closeModal() {
		if (canClose) {
			is_opened = false
		}
	}


</script>
<style>
	.modal {
		position:fixed;
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
		width: 100vw;
		height: 100vh;
		z-index: 8;
		
	}
	.modal-content {
		margin-left: auto;
		margin-right: auto;
		margin-top: auto;
		margin-bottom: auto;
		overflow-y: auto;
		overflow-x: hidden;
		max-height: 80%;
		/* z-index: 8; */
		max-width: 90%;

	}
	.modal-content.fit {
		width:fit-content;
	}
</style>
<div class="modal" class:is-hidden={!is_opened} class:is-active={is_opened}>
	<div class="modal-background" on:click={closeModal} on:keypress={closeModal}></div>
	<div class="modal-content {fit?"fit ":""} ">
		<slot>
		</slot>
	</div>
</div>