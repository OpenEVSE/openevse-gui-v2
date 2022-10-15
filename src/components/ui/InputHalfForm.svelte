<script>
	export let label
	export let value
	export let type
	export let placeholder
	export let disabled = false
</script>
<div class="pt-3 column is-half">
	<span class="has-text-weight-bold">{label}</span>
	<input class="input is-info" type={type} placeholder={placeholder} disabled={disabled} />
</div>