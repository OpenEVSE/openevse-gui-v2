<script>
	import Modal from "../../ui/Modal.svelte"
	import Box from "../../ui/Box.svelte"
	import {onMount} from "svelte"
	import bulmaCalendar from "bulma-calendar"
	export let is_opened = false
	export let value
	//export let linked_field

	let calendars = []

	function mountCalendar() {
			calendars  = bulmaCalendar.attach('.bulmaCalendar', {
			type: 'datetime',
			dateFormat: 'dd/MM/yyyy',
			timeFormat: 'HH:mm',
			lang: navigator.language.substring(0, 2) || "en",
			displayMode: 'inline',
			showButtons: false,
			showTodayButton: true,
			showClearButton: false,
			minuteSteps: 1,
			showHeader: false,
			showFooter: false,
			color: 'info',
			closeOnSelect: false,
			closeOnOverlayClick: true,
			toggleOnInputClick: false,
			todayLabel: 'Current Time'

			});

				// Loop on each calendar initialized
			calendars.forEach(calendar => {
				calendar.value(value)
				// Add listener to select event
				calendar.on('select', (d) => {
					value = d.data.value()	
				})
				// calendar.on('hide', (d) => {
				//  	calendar.save()
				//  })

			})
	}

	onMount(() => {
		mountCalendar()
		
	})
</script>

<Modal bind:is_opened>
	<Box title="Set Date & Time">
		<div class="mt-4 is-flex is-justify-content-center">
			<div class="input is-info bulmaCalendar"></div>	
		</div>
		<div class="is-flex is-justify-content-center mt-4">
			<button class="button is-info is_outlined" on:click={()=>is_opened=false}>Close</button>
		</div>
	</Box>
</Modal>