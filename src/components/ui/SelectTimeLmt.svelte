<script>
    import Select from "./Select.svelte";

	export let value = 0
	export let disabled = false
    export let title
    export let status = ""
    export let onChange = (val)=>{}

	let options = [
    { name: "none", value: 0 },
    { name: "15 min", value: 15 / 15 },
    { name: "30 min", value: 30 / 15 },
    { name: "45 min", value: 45 / 15 },
    { name: "1 hour", value: 60 / 15 },
    { name: "1.5 hours", value: 1.5 * 60 / 15 },
    { name: "2 hours", value: 2 * 60 / 15 },
    { name: "2.5 hours", value: 2.5 * 60 / 15 },
    { name: "3 hours", value: 3 * 60 / 15 },
    { name: "4 hours", value: 4 * 60 / 15 },
    { name: "5 hours", value: 5 * 60 / 15 },
    { name: "6 hours", value: 6 * 60 / 15 },
    { name: "7 hours", value: 7 * 60 / 15 },
    { name: "8 hours", value: 8 * 60 / 15 }
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