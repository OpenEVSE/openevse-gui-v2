<script>
	import Loader from "./Loader.svelte";
	export let status = ""
</script>

<style>
	.state {
        position: absolute;
		top: 28px;
		right: 5px;
        z-index: 2;
		border-radius: 50%;
		display: inline-block;
		width: 32px;
		height: 32px;
		border: 1px solid rgb(50, 179, 212);

    }
</style>

<span class="is-size-5 state has-background-info-light is-flex is-align-items-center is-justify-content-center" class:is-hidden={!status}>
	{#if status=="loading"}
	<Loader color="has-text-info"/>
	{:else if status=="ok"}
	<iconify-icon class="has-text-primary" icon="fa6-solid:check"></iconify-icon>
	{:else if status=="error"}
	<iconify-icon class="has-text-primary" icon="fa6-solid:xmark"></iconify-icon>
	{/if}
</span>
