<script>

export let expand
let size = ""
</script>
<style>
.arrow {
	position: absolute;
	bottom: 0px;
	right: 0px;
	background-color: transparent;
}
</style>
<div class="arrow ">
	{#if !expand}
		<button class="button is-ghost has-text-dark is-inverted" tabindex="0" on:click={() => {expand=true; size=""}} on:mouseenter={() => size = "is-size-4"} on:focus={() => size = "is-size-4"} on:mouseleave={() => size = ""} on:blur={() => size = ""}>
			<iconify-icon class={size} icon="fa6-solid:angle-down"></iconify-icon>
		</button>
	{:else}
		<button class="button is-ghost  has-text-dark is-inverted" tabindex="0" on:click={() => {expand=false; size=""}}  on:mouseenter={() => size = "is-size-4"} on:focus={() => size = "is-size-4"} on:mouseleave={() => size = ""} on:blur={() => size = ""}>
			<iconify-icon class={size} icon="fa6-solid:angle-up"></iconify-icon>
		</button>
	{/if}
</div>