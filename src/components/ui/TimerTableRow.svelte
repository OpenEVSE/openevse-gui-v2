<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import IconButton from "./IconButton.svelte"
	import { faSquarePen, faSquareMinus, faMinus, faCalendarDays } from '@fortawesome/free-solid-svg-icons/index.js'
	import { link, location } from "svelte-spa-router"
	import {displayTime} from "../../lib/utils.js"
	export let t_id
	export let t_time
	export let t_state
	export let t_days
	export let tz = "UTC"
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
	<th>{t_id}</th>
	<th>{displayTime(t_time)}</th>
	<th><span class="tag {t_state === 'active'?'is-primary':'is-danger'} tags py-0 is-capitalized">{t_state}</span></th>
	<th style="width:40%" class="is-size-5-mobile is-size-5-tablet is-size-4-desktop m0 py-1 " align="right">
		<div class="is-flex">
		{#key t_days }
			<div class="mx-1 no-pointer has-tooltip-arrow has-tooltip-info has-tooltip-multiline has-text-weight-normal has-text-centered" data-tooltip={formatDays(t_days)}>
				<Fa icon={faCalendarDays} />
				</div>
		{/key}
			<div class="mx-1 has-text-weight-normal has-text-centered ">
				<a class="has-text-info" href={$location} use:link on:click={() => {edit(t_id)}}>
					<Fa icon={faSquarePen} />
				</a>
			</div>
			<div class="mx-1 has-text-weight-normal has-text-centered">
				<IconButton icon={faSquareMinus} state={removeState} color="has-text-danger" butn_submit={()=>{remove(t_id)}} />
			</div>
		</div>
	</th>
</tr>
