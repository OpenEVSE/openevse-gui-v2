<script>
	import 'iconify-icon';

</script>

<style>
	.spin {
		animation: spin-animation 2s infinite;
		animation-timing-function: linear;
		display: inline-block;
	}

@keyframes spin-animation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

  </style>

<div class="spin is-flex is-justify-content-center is-align-items-center">
	<iconify-icon inline icon="fa6-solid:spinner"></iconify-icon>
</div>