<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faCircleCheck, faCircleXmark} from '@fortawesome/free-solid-svg-icons/index.js'
	export let butn_submit = () => {}
	export let state = ""
	export let name ="Submit"
	let butn
	const displaystate = (state) => { 
		if (state != "") {
			butn.blur()
		}
	} 
	$: displaystate(state)

</script>

<div>
<button bind:this={butn} class="button is-info {state=="loading"?"is-loading":""}" on:click|preventDefault={butn_submit}>
	{name}
</button>
	<span class="is-size-5">
			{#if state == "ok"}
			<Fa class="mx-2 mt-2 has-text-primary is-outlined" icon={faCircleCheck}/>
			{:else if state == "error"}
			<Fa class="mx-2 mt-2 has-text-danger" icon={faCircleXmark}/>
			{/if}
	</span>
</div>