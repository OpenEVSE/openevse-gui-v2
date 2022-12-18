<script>
	import Modal from "../ui/Modal.svelte"
	import 'iconify-icon';

	export let is_opened = false
	let size = ""
</script>
<style>
	.help {
		float: right;
		float: top;
	}
</style>
<div class="help is-size-5">
	<a href={null} class="has-text-info" on:click|preventDefault={()=>is_opened=true} on:mouseenter={()=> size="is-size-4 is-hovered"} on:focus={()=> size="is-size-4 is-hovered"} on:mouseleave={()=> size=""} on:blur={()=> size="is-size-5"}>
		<iconify-icon class=" {size}" icon="fa6-solid:circle-question"></iconify-icon>
	</a>
</div>

<Modal bind:is_opened canClose={true}>
	<div class="notification">
		<button class="delete" on:click={()=>is_opened=false}></button>
		<slot></slot>
	</div>
</Modal>
