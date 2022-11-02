<script>
	import {onMount} from "svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons/index.js'
	import bulmaCalendar from "bulma-calendar"

	export let title = undefined
	export let value
	export let placeholder
	export let type
	export let onChange = () => {}
	export let status = 0
	export let disabled = false
	export let isDate = false

	let show = false
	let typecss = "text"
	let calendars
	let field

	function inputValue(event) {
		event.preventDefault()
		value = event.target.value
	}

	function resetStatus(s) {
		if (s==2||s==3) setTimeout(()=> status = 0,2000)
	}

	function mountCalendar() {
		if (isDate == true) {
			calendars  = bulmaCalendar.attach('.bulmaCalendar', {
			type: 'datetime',
			dateFormat: 'dd/MM/yyyy',
			timeFormat: 'HH:mm',
			lang: navigator.language.substring(0, 2) || "en",
			displayMode: 'dialog',
			showTodayButton: true,
			showClearButton: false,
			minuteSteps: 1,
			showHeader: false,
			showFooter: false,
			color: 'info',
			closeOnSelect: false,
			closeOnOverlayClick: false,
			todayLabel: 'Current Time'

			});

				// Loop on each calendar initialized
			calendars.forEach(calendar => {
				// Add listener to select event
				calendar.on('select', (d) => {
					value = d.data.value()	
				})
				calendar.on('hide', (d) => {
					// trigger change event
					calendar.save()
					field.dispatchEvent(new Event('change'));
				})

			})
		}
	}
	

	$: typecss = show ? "text" : "password"
	$: resetStatus(status)

	onMount(() => {
		typecss = type
		mountCalendar()
	})

</script>

<style>
	.state {
        float: right;
        margin-right: 10px;
        margin-top: -32px;
        position: relative;
        z-index: 2;
    }
</style>
<div class="my-2">
	<form>
		{#if title}
		<span class="has-text-weight-bold">{title}</span>
		{/if}
		<input bind:this={field} class="input is-info {isDate==true?'bulmaCalendar':''}" type={typecss} placeholder={placeholder} value={value} autocomplete="off"
		{disabled} on:change={onChange} on:input={inputValue} >
		<div class="state">
			{#if status==1}
			<Fa class="has-text-info"icon={faSpinner} spin />
			{:else if status==2}
			<Fa class="has-text-primary" icon={faCheck}/>
			{:else if status==3}
			<Fa class="has-text-danger" icon={faXmark}/>
			{/if}
		</div>
		{#if type=="password"}	
		<div class="my-2">
			<label class="checkbox">
				<input type="checkbox" bind:checked={show}>
				Show
			</label>
		</div>
		{/if}
	</form>	
</div>

