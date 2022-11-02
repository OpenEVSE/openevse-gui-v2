<script>
	import {onMount} from "svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons/index.js'
	import "../../../library/bulma-calendar"

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

	function inputValue(event) {
		value = event.target.value
	}

	function resetStatus(s) {
		if (s==2||s==3) setTimeout(()=> status = 0,2000)
	}

	function mountCalendar() {
		if (isDate == true) {
			calendars  = bulmaCalendar.attach('.bulmaCalendar', {
			type: 'datetime',
			lang: navigator.language.substring(0, 2) || "en",
			displayMode: 'dialog',
			showTodayButton: false,
			showClearButton: false,
			minuteSteps: 1,
			showHeader: false,

			});

				// Loop on each calendar initialized
			calendars.forEach(calendar => {
				// Add listener to select event
				calendar.on('select', () => {
				
				});
			});

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
		<input class="input is-info {isDate==true?'bulmaCalendar':''}" type={typecss} placeholder={placeholder} value={value} autocomplete="off"
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

