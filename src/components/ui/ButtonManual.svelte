<script>
	import ButtonManualItem from "./ButtonManualItem.svelte";
	import { _ } from 'svelte-i18n'

	export let mode // 0: Auto, 1: On, 2: OFF
	export let ischarging = false
	export let setmode = (m) => {}
	export let isauto = false
	export let noenable = false
	export let disabled = false

	
</script>

<style>
	.buttonblock {
		width: fit-content;	
	}
</style>

<svelte:options accessors/>
<div class="is-flex is-flex-wrap-nowrap buttonblock buttons field is-grouped has-addons">
	{#if !noenable}
	<ButtonManualItem mode={mode} role={1} {ischarging} {disabled} onClick = {()=>setmode(1)} icon="fa6-solid:bolt" tooltip={disabled?null:$_("charge-enable")}   />
	{/if}
	{#if isauto}
	<ButtonManualItem mode={mode} role={0} {ischarging} {disabled} onClick = {()=>setmode(0)} icon="fa6-solid:robot" tooltip={disabled?null:$_("charge-auto")}   />
	{/if}
	<ButtonManualItem mode={mode} role={2} {ischarging} {disabled} onClick = {()=>setmode(2)} icon="fa6-solid:ban" tooltip={disabled?null:$_("charge-disable")}   />
</div>