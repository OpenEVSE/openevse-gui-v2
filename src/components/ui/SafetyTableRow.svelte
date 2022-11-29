<script>
import Fa 								from 'svelte-fa/src/fa.svelte'
import { faCircleCheck, faCircleXmark} 	from '@fortawesome/free-solid-svg-icons/index.js'
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
		<Fa class="is-size-5 mt-1 {checked?"has-text-primary":"has-text-danger"}" icon={checked?faCircleCheck:faCircleXmark} />
		{:else}
		<Switch {name} is_rtl={true} bind:checked {onChange}/>
		{/if}
	</td>
</tr>