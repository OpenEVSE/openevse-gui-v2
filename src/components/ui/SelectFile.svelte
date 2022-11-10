<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faUpload} from '@fortawesome/free-solid-svg-icons/index.js'
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
			<Fa icon={faUpload}/>
		  Choose a file…
		  
</button>
