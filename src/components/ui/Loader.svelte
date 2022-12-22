<script>
	
	export let size = ""
	export let color = ""

</script>

<style>
	/* .spin {
		animation: spin-animation 2s infinite;
		animation-timing-function: linear;
		display: inline-block;
	} */
/* 
@keyframes spin-animation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
		
    }
} */

  </style>

<iconify-icon class="{size} {color?color:""}" icon="eos-icons:loading"></iconify-icon>