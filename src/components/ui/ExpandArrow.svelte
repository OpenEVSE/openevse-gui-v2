<script>
import Fa from 'svelte-fa/src/fa.svelte'
import { faAngleDown, faAngleUp, faAngleRight } from '@fortawesome/free-solid-svg-icons/index.js'
export let expand
let size = "sm"
</script>
<style>
.arrow {
	position: absolute;
	bottom: 0px;
	right: 5px;
	background-color: transparent;
}
</style>
<div class="arrow">
	{#if !expand}
		<button class="button is-ghost is-inverted" tabindex="0" on:click={() => {expand=true; size="sm"}} on:mouseenter={() => size = "lg"} on:focus={() => size = "lg"} on:mouseleave={() => size = "sm"} on:blur={() => size = "sm"}>
			<Fa size={size} icon={faAngleDown} />
		</button>
	{:else}
		<button class="button is-ghost  is-inverted" tabindex="0" on:click={() => {expand=false; size="sm"}}  on:mouseenter={() => size = "lg"} on:focus={() => size = "lg"} on:mouseleave={() => size = "sm"} on:blur={() => size = "sm"}>
			<Fa size={size} icon={faAngleUp} />
		</button>
	{/if}
</div>