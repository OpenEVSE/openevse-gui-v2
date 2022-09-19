<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faSquarePen, faSquareMinus, faCalendarDays } from '@fortawesome/free-solid-svg-icons/index.js'

	export let t_id;
	export let t_time;
	export let t_state;
	export let t_days;
	
	export let edit = (id) => {};

	function display_days(d) {
		return "MTW..SS"

	}
</script>
<tr>
	<th>{t_id}</th>
	<th>{t_time}</th>
	<th><span class="tag is-primary py-0">{t_state}</span></th>
	<th class="is-size-5 py-1 px-1 has-tooltip-arrow has-tooltip" data-tooltip="Mon Tue Wed Thi Fri . Sun">
		<Fa icon={faCalendarDays} />
	</th>
	<th class="is-size-5 py-1 px-1 pr-2">
		<a href="#" on:click={() => {edit(t_id)}}>
			<Fa icon={faSquarePen} />
		</a>
	</th>
	<th class="is-size-5 py-1 px-0" >
		<a href="#" class="has-text-danger">
			<Fa icon={faSquareMinus} />
		</a>
	</th>
</tr>