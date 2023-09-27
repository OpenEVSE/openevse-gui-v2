<script>
  import { uistates_store }   from "./../../../lib/stores/uistates.js";
  import { _ }                from 'svelte-i18n'
  import Box                  from "./../../ui/Box.svelte";
  import Borders              from "./../../ui/Borders.svelte";
  import Button               from "../../ui/Button.svelte"
	import CertificatesModal    from "./CertificatesModal.svelte";
	import {certificate_store}  from "../../../lib/stores/certificates.js"

  let certificates_modal_opened = false

  function uploadCertificate() {
    certificates_modal_opened = true;
  }

</script>

<Box title={$_("config.titles.certificates")} icon="mdi:certificate" back={true}>
	<div class="my-2 is-flex is-justify-content-center is-align-items-center is-flex-direction-column" >
    <Borders>
      {#if $certificate_store.length}
			<table class="table is-size-6 has-text-weight-normal" >
        <thead>
          <tr>
            <th class="has-text-centered has-text-dark"><abbr title={$_("config.certificates.id")}>{$_("config.certificates.id")}</abbr></th>
            <th class="has-text-centered has-text-dark"><abbr title={$_("config.certificates.type")}>{$_("config.certificates.type")}</abbr></th>
            <th class="has-text-centered has-text-dark"><abbr title="{$_("config.certificates.name")}">{$_("config.certificates.name")}</abbr></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {#each $certificate_store as item}
            <tr>
              <td class="has-text-dark">{ item.id }</td>
              <td class="has-text-dark">{ $_("config.certificates."+item.type) }</td>
              <td class="has-text-dark">{ item.name }</td>
              <td class="has-text-dark">
                <Button icon="mdi:delete"></Button>
              </td>
            </tr>
            {/each}
        </tbody>
      </table>
			{:else}
			<div class="content">{$_("config.certificates.empty")}</div>
			{/if}	
    </Borders>
		<div class="mt-4">
      <Button name={$_("config.certificates.upload")} butn_submit={uploadCertificate}/>
    </div>
  </div>

</Box>

{#if certificates_modal_opened}
<CertificatesModal bind:is_opened={certificates_modal_opened} />
{/if}