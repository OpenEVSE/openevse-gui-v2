<script>
	import { _ } 				from 'svelte-i18n'
	import IconButton 			from "./IconButton.svelte"
	import { link, location } 	from "svelte-spa-router"
	import {displayTime}		from "../../lib/utils.js"
	export let t_id
	export let t_time
	export let t_state
	export let t_days
	export let edit = (id) => {}
	export let remove = (id) => {}
	export let removeState = ""

	function formatDays(days){
    	// const d = days.toString().replace(/,/g, " ");
		let td = ""
		days.forEach(e => {
			td += $_("days." + e) + " "
		});
    	return td
    }

</script>
<style>
	.no-pointer {
		cursor: default
	}
	.tags {
		width: 100%;
	}
	.del {
		position: absolute;
	}
	.delabs {
		position: relative;

	}
</style>

<tr>
	<!-- <th>{t_id}</th> -->
	<th style="width:20%" class="is-size-7-mobile has-text-dark">{displayTime(t_time)}</th>
	<th style="width:10%"><span class="tag {t_state === 'active'?'is-primary':'is-dark'} tags py-0 is-capitalized">{t_state == "active"?$_("active"):$_("disabled")}</span></th>
	<th style="" class="is-size-4 m0 py-1">
		<div class="is-flex is-justify-content-center">

			<div class="mr-2 no-pointer has-tooltip-arrow- has-tooltip-top has-tooltip-info has-tooltip-multiline has-text-weight-normal is-capitalized" data-tooltip={formatDays(t_days)}>
				<iconify-icon inline class="has-text-info" icon="ion:calendar"></iconify-icon>
			</div>

			<div class="mr-2 has-text-weight-normal">
				<a class="has-text-info" href={$location} use:link on:click={() => {edit(t_id)}}>
					<iconify-icon inline class="is-size-4" icon="fa6-solid:square-pen"></iconify-icon>
				</a>
			</div>
			<div class="delabs">
				<div class="del">
					<IconButton 
					icon="fa6-solid:xmark" 
					size="is-size-5" 
					state={removeState} 
					color="has-text-danger" 
					butn_submit={()=>{remove(t_id)}} 
				/>
				</div>
			</div>

		</div>
	</th>
</tr>
