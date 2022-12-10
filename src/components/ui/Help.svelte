<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons/index.js'
	import Modal from "../ui/Modal.svelte"
	import { link } from "svelte-spa-router"

	export let is_opened = false
</script>
<style>
	.help {
		float: right;
		float: top;
	}
</style>
<div class="help is-size-5">
	<a href={null} on:click|preventDefault={()=>is_opened=true}><Fa class="has-text-info" icon={faCircleQuestion}/></a>
</div>

<Modal bind:is_opened canClose={true}>
	<div class="notification">
		<button class="delete" on:click={()=>is_opened=false}></button>
		<slot></slot>
	</div>
</Modal>
