<script>
	import IconButton from "./IconButton.svelte"
	import 'iconify-icon';
	import { link, location } from "svelte-spa-router"
	import {displayTime} from "../../lib/utils.js"
	export let t_id
	export let t_time
	export let t_state
	export let t_days
	export let edit = (id) => {}
	export let remove = (id) => {}
	export let removeState = ""

	function formatDays(days){
    	var d = days.toString().replace(/,/g, " "); 
    	return d
    }

</script>
<style>
	.no-pointer {
		cursor: default
	}
	.tags {
		width: 100%;
	}
</style>

<tr>
	<!-- <th>{t_id}</th> -->
	<th style="width:20%">{displayTime(t_time)}</th>
	<th style="width:40%"><span class="tag {t_state === 'active'?'is-primary':'is-danger'} tags py-0 is-capitalized">{t_state}</span></th>
	<th style="width:40%" class="is-size-4 m0 py-1">
		<div class="is-flex is-justify-content-center is-align-items-center">

			<div class=" no-pointer has-tooltip-arrow has-tooltip-info has-tooltip-multiline has-text-weight-normal" data-tooltip={formatDays(t_days)}>
				<iconify-icon inline class="mt-1" style="font-size: 30px" icon="fluent:calendar-ltr-20-filled"></iconify-icon>
			</div>

			<div class="mx-1 has-text-weight-normal">
				<a class="has-text-info" href={$location} use:link on:click={() => {edit(t_id)}}>
					<iconify-icon inline class="is-size-4" icon="fa6-solid:square-pen"></iconify-icon>
				</a>
			</div>
			<div class="mx-1 has-text-weight-normal">
				<IconButton icon="fa6-solid:square-minus" size="is-size-4" state={removeState} color="has-text-danger" butn_submit={()=>{remove(t_id)}} />
			</div>
		</div>
	</th>
</tr>
