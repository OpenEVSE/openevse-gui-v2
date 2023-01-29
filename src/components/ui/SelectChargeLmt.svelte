<script>
	import Select from "./Select.svelte";

	export let value = 0
	export let disabled=false
    export let title
    export let status = ""
    export let onChange = (val)=>{}


	let options = [
    { name: "none", value: 0 },
    { name: "1 kWh", value: 1 },
    { name: "2 kWh", value: 2 },
    { name: "3 kWh", value: 3 },
    { name: "4 kWh", value: 4 },
    { name: "5 kWh", value: 5 },
    { name: "6 kWh", value: 6 },
    { name: "7 kWh", value: 7 },
    { name: "8 kWh", value: 8 },
    { name: "9 kWh", value: 9 },
    { name: "10 kWh", value: 10 },
    { name: "15 kWh", value: 15 },
    { name: "20 kWh", value: 20 },
    { name: "25 kWh", value: 25 },
    { name: "30 kWh", value: 30 },
    { name: "35 kWh", value: 35 },
    { name: "40 kWh", value: 40 },
    { name: "45 kWh", value: 45 },
    { name: "50 kWh", value: 50 },
    { name: "55 kWh", value: 55 },
    { name: "60 kWh", value: 60 },
    { name: "70 kWh", value: 70 },
    { name: "80 kWh", value: 80 },
    { name: "90 kWh", value: 90 }
    ];


</script>

<div class="mx-2 is-flex is-align-items-center is-flex-direction-column">
	<div class="has-text-weight-bold has-text-centered has-text-info">{title}</div>
    <Select 
    bind:value
    bind:status
    {disabled}
    items={options} 
    onChange={onChange}
    />
</div>