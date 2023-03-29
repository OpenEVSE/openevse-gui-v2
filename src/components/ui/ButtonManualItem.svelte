<script>
	import { onMount } from "svelte";
	import { _ } from 'svelte-i18n'

	export let mode		 // 0: Auto, 1: On, 2: OFF
	export let role      // 0: Auto, 1: On, 2: OFF
	export let ischarging = false
	export let onClick = (m) => {}
	export let disabled = false
	export let icon
	export let tooltip
	let color

	onMount(()=>{
		color = role == 0 ? "is-info" : role == 1 ? "is-primary" : "is-dark"
	})
</script>
<style>
	.button  {
		margin: 0;
		min-height: 50px;
	}
	.no-pointer {
		cursor: default;
		pointer-events: none;
	}
	.noborderleft {
		border-left:0px
	}
	.noborderright {
		border-right:0px
	}
	
</style>



<button {disabled} class="{mode==role || disabled?"no-pointer":""} {mode == role?"":"is-outlined"} 
	{role == "2"?"noborderleft":role == 1 ? "noborderright" : ""} 
	button is-large is-responsive button has-tooltip-arrow {color} {mode == role && ischarging?"has-text-warning":""}"
	data-tooltip={disabled?null:tooltip}
	on:click|preventDefault={onClick}>

	<div class="mx-4  is-flex">
		<iconify-icon class="is-flex-grow-1 is-flex-shrink-0 is-size-3" icon={icon}></iconify-icon>
	</div>

</button>