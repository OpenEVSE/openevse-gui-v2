import { writable } from 'svelte/store'
import { httpAPI } from '../utils.js'

function createCertificateStore() {
  const P = writable([])
  const { subscribe, set, update } = P

  async function download() {
    let res = await httpAPI("GET", "/certificates")
    if (res && (res.msg != "error" && res != "error")) {
      P.update(() => res)
      return true
    }
    else return false
  }

  async function upload(data) {
    let res = await httpAPI("POST", "/certificates", JSON.stringify(data))
    res.success = res.msg == "done"
    return res
  }

  async function remove(id) {
    let res = await httpAPI("DELETE", "/certificates/" + id)
    if (res.msg == "done")
      return true
    else return false
  }

  return {
    subscribe,
    set,
    update,
    download,
    remove: (id) => remove(id),
    upload: (certificate) => upload(certificate)
  }
}

export const certificate_store = createCertificateStore()