<script>
	
	export let icon
	export let color
	export let bp // breakpoint
	export let classes = ""
</script>

<iconify-icon class="{classes} {color} {bp == "mobilemini"?"is-size-5":"is-size-4"}" {icon}></iconify-icon>