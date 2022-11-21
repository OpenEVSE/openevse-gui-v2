<script>
import Fa from 'svelte-fa/src/fa.svelte'
import { faAngleDown, faAngleUp, faAngleRight } from '@fortawesome/free-solid-svg-icons/index.js'
export let expand
let size = "lg"
</script>
<style>
.arrow {
	position: absolute;
	bottom: 0px;
	right: 5px;
	background-color: transparent;
}
</style>
<div class="arrow ">
	{#if !expand}
		<button class="button is-ghost has-text-dark is-inverted" tabindex="0" on:click={() => {expand=true; size="lg"}} on:mouseenter={() => size = "2x"} on:focus={() => size = "2x"} on:mouseleave={() => size = "lg"} on:blur={() => size = "lg"}>
			<Fa size={size} icon={faAngleDown} />
		</button>
	{:else}
		<button class="button is-ghost  has-text-dark is-inverted" tabindex="0" on:click={() => {expand=false; size="lg"}}  on:mouseenter={() => size = "2x"} on:focus={() => size = "2x"} on:mouseleave={() => size = "lg"} on:blur={() => size = "lg"}>
			<Fa size={size} icon={faAngleUp} />
		</button>
	{/if}
</div>