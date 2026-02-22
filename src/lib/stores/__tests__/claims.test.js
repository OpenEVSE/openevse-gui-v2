import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get } from 'svelte/store'

vi.mock('../../utils.js', () => ({
  httpAPI: vi.fn()
}))

vi.mock('../../vars.js', () => ({
  EvseClients: {
    manual: { id: 65537, priority: 1000 },
    divert: { id: 65538, priority: 50 }
  }
}))

import { claims_store } from '../claims.js'
import { httpAPI } from '../../utils.js'

describe('claims_store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    claims_store.set(undefined)
  })

  it('should have all required methods', () => {
    expect(typeof claims_store.subscribe).toBe('function')
    expect(typeof claims_store.download).toBe('function')
    expect(typeof claims_store.upload).toBe('function')
    expect(typeof claims_store.release).toBe('function')
    expect(typeof claims_store.getClaim).toBe('function')
    expect(typeof claims_store.removeClaimProp).toBe('function')
  })

  it('should download claims', async () => {
    const mockClaims = [
      { client: 65537, state: 'active', priority: 1000 }
    ]
    httpAPI.mockResolvedValue(mockClaims)

    const result = await claims_store.download()
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('GET', '/claims')

    const state = get(claims_store)
    expect(state).toHaveLength(1)
    expect(state[0].client).toBe(65537)
  })

  it('should return false on download error', async () => {
    httpAPI.mockResolvedValue('error')
    const result = await claims_store.download()
    expect(result).toBe(false)
  })

  it('should upload claim data for client', async () => {
    httpAPI.mockResolvedValue({ msg: 'done' })
    const data = { state: 'active', charge_current: 24 }
    const result = await claims_store.upload(data, 65537)
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('POST', '/claims/65537', JSON.stringify(data))
  })

  it('should return false on upload failure', async () => {
    httpAPI.mockResolvedValue({ msg: 'error' })
    const result = await claims_store.upload({}, 65537)
    expect(result).toBe(false)
  })

  it('should release claim for default client', async () => {
    httpAPI.mockResolvedValue({ msg: 'done' })
    const result = await claims_store.release()
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('DELETE', '/claims/65537')
  })

  it('should release claim for specific client', async () => {
    httpAPI.mockResolvedValue({ msg: 'done' })
    const result = await claims_store.release(65538)
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('DELETE', '/claims/65538')
  })

  it('should get claim by client id', () => {
    claims_store.set([
      { client: 65537, state: 'active', priority: 1000 },
      { client: 65538, state: 'disabled', priority: 50 }
    ])

    const claim = claims_store.getClaim(65537)
    expect(claim.client).toBe(65537)
    expect(claim.state).toBe('active')
  })
})
