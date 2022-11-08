<script>
	import {onMount, onDestroy} from "svelte"
	export let is_opened = false

	onMount (disablescroll)
	onDestroy (enablescroll)

	function disablescroll() {
		// To get the scroll position of current webpage
		let TopScroll = window.pageYOffset || document.documentElement.scrollTop
		let LeftScroll = window.pageXOffset || document.documentElement.scrollLeft

		// if scroll happens, set it to the previous value
		window.onscroll = function() {
		window.scrollTo(LeftScroll, TopScroll);
				};
	}

	function enablescroll() {
		window.onscroll = function() {};
	}


</script>
<style>
	.modal {
		position:fixed;
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
		width: 100%;
		height: 100%
	}
	
</style>

	<div class="modal" class:is-active={is_opened}>
		<div class="modal-background" on:click={()=>is_opened = false}></div>
		<div class="modal-content p-3">
			<slot>
			</slot>
		</div>
	</div>