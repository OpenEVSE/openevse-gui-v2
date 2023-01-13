<script>
	import {onMount, onDestroy} from "svelte"
	export let is_opened = false
	export let canClose = true

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
		height: 100%;
	}
	
</style>
<div class="modal" class:is-active={is_opened}>
	<div class="modal-background" on:click={closeModal} on:keypress={closeModal}></div>
	<div class="modal-content p-3">
		<slot>
		</slot>
	</div>
</div>