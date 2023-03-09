<script>
	
	export let file = ""
	export let mini = false
	export let width = null
	export let ext = ".*"
	export let icon = null
	export let title = "Select"

	let inputfield
	let button


	const onFileSelected =(e)=>{
		file = e.target.files[0];
	}

	const onClick = () => {
		button.blur()
		inputfield.click()
	}

</script>

<button bind:this={button} class="button is-info is-outlined {mini?"is-responsive":""}" style:width={width}  on:click={onClick}>
	<div class="is-flex is-align-items-center is-justify-content-center" style:width={width} >
		{#if icon}
		<div>
			<iconify-icon inline icon={icon} class="{!mini?"is-size-5-mobile is-size-6":"is-size-6"}" ></iconify-icon>
		</div>
		{/if}
		<div class="">{title}</div>	
	</div>  
</button>
	
<div class="is-hidden">
	<input class="file-input" bind:this={inputfield} type="file" on:change={(e)=>onFileSelected(e)} accept={ext} />
</div>
