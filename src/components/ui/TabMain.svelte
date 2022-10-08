<script>
	import { link } from "svelte-spa-router";
	import active from 'svelte-spa-router/active'
</script>

<div class="tabs is-family-monospace has-text-weight-semibold">
	<ul>
	  <li use:active={{path: '/', className: 'is-active'}}>
		<a href="/" use:link>
		  <span>Manual</span>
		</a>
	  </li>
	  <li use:active={{path: '/schedule*', className: 'is-active'}}>
		<a href="/schedule" use:link>
		  <span>Schedule</span>
		</a>
	  </li>
	  <li use:active={{path: '/logs', className: 'is-active'}}>
		<a href="/logs" use:link>
		  <span>Logs</span>
		</a>
	  </li>
	</ul>
  </div>