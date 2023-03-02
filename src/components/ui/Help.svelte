<script>
	import Modal from "../ui/Modal.svelte"
	export let is_opened = false
</script>
<style>
	
	.help:hover {
		transform: scale(1.2);
	}
	.notification {
		overflow-y: scroll;
		height: 100%;
	}
	.content {
		overflow-y: auto;
		height: fit-content;
	}
</style>

<div class="help m-0 p-0">
	<a href={null} class="has-text-info" on:click|preventDefault={()=>is_opened=true} >
		<div style="width: 28px; height:28px" class="has-text-centered">
			<iconify-icon inline class="is-size-5" icon="fa6-solid:circle-question"></iconify-icon>
		</div>
	</a>
</div>
<Modal bind:is_opened canClose={true}>
	<div class="notification is-link is-light has-text-left is-size-6">
		<button class="delete" on:click={()=>is_opened=false}></button>
		<div class="content">
			<slot></slot>
		</div>
	</div>
</Modal>


