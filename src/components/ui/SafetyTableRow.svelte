<script>

import Switch 							from "./Switch.svelte"

export let title
export let name
export let editable = false
export let checked
export let onChange = () => {}
</script>

<tr class="">
	<td class="is-vcentered">{title}</td>
	<td class="p-0 m-0 is-vcentered has-text-centered">
		{#if !editable}
		<iconify-icon inline class="is-size-5 {checked?"has-text-primary":"has-text-danger"}" icon={checked?"fa6-solid:circle-check":"fa6-solid:circle-xmark"}></iconify-icon>
		{:else}
		<Switch {name} is_rtl={true} bind:checked {onChange}/>
		{/if}
	</td>
</tr>