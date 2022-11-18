<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons/index.js'
	export let action = () => {}
	export let state = ""
</script>

<svelte:options accessors/>
{#if state == ""}
<button class="button delete is-small" on:click={action}></button>
{:else if state == "loading"}
<Fa class="ml-1" icon={faSpinner} spin={state=="loading"} />
{:else if state == "ok"}
<Fa class="ml-1" icon={faCheck} />
{:else}
<Fa class="ml-1" icon={faXmark} />
{/if}