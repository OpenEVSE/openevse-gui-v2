<script>
	export let label;
	export let value;
	export let type;
	export let placeholder;
</script>
<div class="pt-3 column is-half">
	<span class="has-text-weight-bold">{label}</span>
	<input class="input is-info" type={type} placeholder={placeholder} value={value} />
</div>