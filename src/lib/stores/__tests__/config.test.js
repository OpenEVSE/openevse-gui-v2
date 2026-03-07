import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get } from 'svelte/store'

// Mock httpAPI before importing config store
vi.mock('../../utils.js', () => ({
  httpAPI: vi.fn()
}))

import { config_store } from '../config.js'
import { httpAPI } from '../../utils.js'

describe('config_store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    config_store.set(undefined)
  })

  it('should have subscribe method', () => {
    expect(typeof config_store.subscribe).toBe('function')
  })

  it('should have download method', () => {
    expect(typeof config_store.download).toBe('function')
  })

  it('should have upload method', () => {
    expect(typeof config_store.upload).toBe('function')
  })

  it('should have saveParam method', () => {
    expect(typeof config_store.saveParam).toBe('function')
  })

  it('should download config and update store', async () => {
    const mockConfig = { hostname: 'openevse', firmware: 'v1.0.0' }
    httpAPI.mockResolvedValue(mockConfig)

    const result = await config_store.download()
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('GET', '/config')

    const state = get(config_store)
    expect(state.hostname).toBe('openevse')
    expect(state.firmware).toBe('v1.0.0')
  })

  it('should return false on download error', async () => {
    httpAPI.mockResolvedValue('error')
    const result = await config_store.download()
    expect(result).toBe(false)
  })

  it('should return false when download returns error msg', async () => {
    httpAPI.mockResolvedValue({ msg: 'error' })
    const result = await config_store.download()
    expect(result).toBe(false)
  })

  it('should upload config data', async () => {
    httpAPI.mockResolvedValue({ msg: 'done' })

    const data = { hostname: 'newname' }
    const result = await config_store.upload(data)
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('POST', '/config', JSON.stringify(data))
  })

  it('should return true for upload with no change', async () => {
    httpAPI.mockResolvedValue({ msg: 'no change' })
    const result = await config_store.upload({ hostname: 'same' })
    expect(result).toBe(true)
  })

  it('should return false on upload failure', async () => {
    httpAPI.mockResolvedValue({ msg: 'error' })
    const result = await config_store.upload({ hostname: 'fail' })
    expect(result).toBe(false)
  })

  it('should detect European firmware and set derived properties', async () => {
    const mockConfig = { firmware: 'v5.1.0.EU' }
    httpAPI.mockResolvedValue(mockConfig)

    await config_store.download()
    const state = get(config_store)
    expect(state.firmware_is_eu).toBe(true)
    expect(state.max_current_firmware).toBe(32)
  })

  it('should detect T2 as European firmware', async () => {
    const mockConfig = { firmware: 'v5.1.0.T2' }
    httpAPI.mockResolvedValue(mockConfig)

    await config_store.download()
    const state = get(config_store)
    expect(state.firmware_is_eu).toBe(true)
    expect(state.max_current_firmware).toBe(32)
  })

  it('should detect non-European firmware', async () => {
    const mockConfig = { firmware: 'v5.1.0' }
    httpAPI.mockResolvedValue(mockConfig)

    await config_store.download()
    const state = get(config_store)
    expect(state.firmware_is_eu).toBe(false)
    expect(state.max_current_firmware).toBe(80)
  })

  it('should maintain derived properties when using set', () => {
    config_store.set({ firmware: 'v5.2.0.EU', hostname: 'test' })
    const state = get(config_store)
    expect(state.firmware_is_eu).toBe(true)
    expect(state.max_current_firmware).toBe(32)
  })

  it('should maintain derived properties when using update', () => {
    config_store.set({ firmware: 'v5.2.0', hostname: 'test' })
    config_store.update(curr => ({ ...curr, hostname: 'updated' }))
    const state = get(config_store)
    expect(state.firmware_is_eu).toBe(false)
    expect(state.hostname).toBe('updated')
  })

  it('should save individual parameter', async () => {
    config_store.set({ firmware: 'v5.1.0', hostname: 'openevse' })
    httpAPI.mockResolvedValue({ msg: 'done' })

    const result = await config_store.saveParam('hostname', 'newname')
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('POST', '/config', JSON.stringify({ hostname: 'newname' }))

    const state = get(config_store)
    expect(state.hostname).toBe('newname')
  })

  it('should return false when saveParam upload fails', async () => {
    config_store.set({ firmware: 'v5.1.0', hostname: 'openevse' })
    httpAPI.mockResolvedValue({ msg: 'error' })

    const result = await config_store.saveParam('hostname', 'fail')
    expect(result).toBe(false)
  })
})
