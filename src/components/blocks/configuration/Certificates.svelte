<script>
  import { uistates_store }   from "./../../../lib/stores/uistates.js";
  import { _ }                from 'svelte-i18n'
  import Box                  from "./../../ui/Box.svelte";
  import Borders              from "./../../ui/Borders.svelte";
  import Button               from "../../ui/Button.svelte"
  import IconButton           from "../../ui/IconButton.svelte"
	import CertificatesModal    from "./CertificatesModal.svelte";
	import { certificate_store }  from "../../../lib/stores/certificates.js"
	import { serialQueue }      from "./../../../lib/queue.js";

  let certificates_modal_opened = false
  let removeCertificateState = ""

	async function removeCertificate(id) {
    let certificate = $certificate_store.findIndex(item => item.id === id)
    removeCertificateState = "loading"
    if (certificate > -1)
    {
      if(await serialQueue.add(() => certificate_store.remove(id)))
      {
        $certificate_store.splice(certificate,1)
        $certificate_store = $certificate_store
        removeCertificateState = ""
      }
    }
  }

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
                <div class="delabs">
                  <div class="del">
                    <IconButton
                      icon="fa6-solid:xmark"
                      size="is-size-5"
                      state={removeCertificateState}
                      color="has-text-danger"
                      butn_submit={()=>{removeCertificate(item.id)}}
                    />
                  </div>
                </div>
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
