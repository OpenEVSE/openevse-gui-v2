<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faUpload} from '@fortawesome/free-solid-svg-icons/index.js'
	export let file = ""

	const onFileSelected =(e)=>{
		file = e.target.files[0];
	}

</script>
<button class="button is-info is-outlined">
	  <input class="file-input" type="file" on:change={(e)=>onFileSelected(e)} accept=".bin,.hex" />
			<Fa icon={faUpload}/>
		  Choose a file…
</button>