import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get } from 'svelte/store'

vi.mock('../../utils.js', () => ({
  httpAPI: vi.fn()
}))

import { status_store } from '../status.js'
import { httpAPI } from '../../utils.js'

describe('status_store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    status_store.set(undefined)
  })

  it('should have all required methods', () => {
    expect(typeof status_store.subscribe).toBe('function')
    expect(typeof status_store.set).toBe('function')
    expect(typeof status_store.update).toBe('function')
    expect(typeof status_store.download).toBe('function')
  })

  it('should download status data', async () => {
    const mockStatus = {
      state: 1,
      vehicle: 1,
      colour: 1,
      charge_current: 0,
      ipaddress: '192.168.1.100'
    }
    httpAPI.mockResolvedValue(mockStatus)

    const result = await status_store.download()
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('GET', '/status')

    const state = get(status_store)
    expect(state.state).toBe(1)
    expect(state.ipaddress).toBe('192.168.1.100')
  })

  it('should return false on download error string', async () => {
    httpAPI.mockResolvedValue('error')
    const result = await status_store.download()
    expect(result).toBe(false)
  })

  it('should return false on download error msg', async () => {
    httpAPI.mockResolvedValue({ msg: 'error' })
    const result = await status_store.download()
    expect(result).toBe(false)
  })

  it('should return false on null response', async () => {
    httpAPI.mockResolvedValue(null)
    const result = await status_store.download()
    expect(result).toBe(false)
  })
})
