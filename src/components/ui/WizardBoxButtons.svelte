<script>
	import {push} 			  from 'svelte-spa-router'
	export let step

	function goNext() {

		step +=  1
		push('/wizard/' + step)
	}

function goPrev() {
step -= 1
push('/wizard/' + step)
}

</script>

<div class="is-flex is-justify-content-center my-3">
	{#if step > 0}
	<button class="button is-white mr-4" on:click={goPrev}>
		<iconify-icon class="is-size-5" icon="material-symbols:navigate-before"></iconify-icon> 
		Previous &nbsp;
	</button>
	{/if}
	{#if step < 4}
	<button class="button is-white ml-4" on:click={goNext}>
		&nbsp; Next
		<iconify-icon class="is-size-5" icon="material-symbols:navigate-next"></iconify-icon> 
	</button>
	{/if}
	{#if step == 4}
	<button class="button is-white ml-4"on:click={()=>push("/")}>
		&nbsp; Quit Wizard &nbsp;
	</button>
	{/if}
</div>