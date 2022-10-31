<script>
	import { link } from "svelte-spa-router";
	import active from 'svelte-spa-router/active'
</script>
<style>
	.tab:hover {
		background-color: hsl(0, 0%, 96%);
	}
	.tab:focus {
			outline: none;
			background-color: hsl(0, 0%, 96%);
	}
</style>
<div class="tabs is-uppercase is-size-6 is-size-7-mobile">
	<ul>
	  <li use:active={{path: '/', className: 'is-active has-text-info'}}>
		<a class="tab" href="/" use:link>
		  <span>Manual</span>
		</a>
	  </li>
	  <li use:active={{path: '/schedule*', className: 'is-active has-text-info'}}>
		<a class="tab" href="/schedule" use:link>
		  <span>Schedule</span>
		</a>
	  </li>
	</ul>
  </div>