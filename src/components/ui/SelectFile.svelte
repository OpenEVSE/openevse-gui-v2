<script>
	import 'iconify-icon';
	export let file = ""
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

<div class="is-hidden"><input class="file-input" bind:this={inputfield} type="file" on:change={(e)=>onFileSelected(e)} accept=".bin,.hex" /></div>
<button bind:this={button} class="button is-info is-outlined" on:click={onClick}>
	<iconify-icon icon="fa6-solid:file-export" class="is-size-5" ></iconify-icon>
	<span class="ml-1">Select</span>	  
</button>
