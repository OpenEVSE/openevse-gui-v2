import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get } from 'svelte/store'

vi.mock('../../utils.js', () => ({
  httpAPI: vi.fn(),
  dedup: vi.fn((arr) => {
    const hashTable = {}
    return arr.filter((el) => {
      const key = JSON.stringify(el)
      const match = Boolean(hashTable[key])
      return match ? false : (hashTable[key] = true)
    })
  })
}))

import { history_store } from '../history.js'
import { httpAPI } from '../../utils.js'

describe('history_store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    history_store.set(undefined)
  })

  it('should have all required methods', () => {
    expect(typeof history_store.subscribe).toBe('function')
    expect(typeof history_store.download).toBe('function')
    expect(typeof history_store.set).toBe('function')
    expect(typeof history_store.update).toBe('function')
  })

  it('should download history by index', async () => {
    const mockLogs = [
      { time: '2024-01-02T10:00:00Z', state: 3 },
      { time: '2024-01-01T08:00:00Z', state: 1 }
    ]
    httpAPI.mockResolvedValue(mockLogs)

    const result = await history_store.download(0)
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('GET', '/logs/0')

    const state = get(history_store)
    expect(state).toHaveLength(2)
  })

  it('should merge with existing data and deduplicate', async () => {
    // Set initial data
    const initialData = [
      { time: '2024-01-01T08:00:00Z', state: 1 }
    ]
    history_store.set(initialData)

    const newData = [
      { time: '2024-01-02T10:00:00Z', state: 3 },
      { time: '2024-01-01T08:00:00Z', state: 1 } // duplicate
    ]
    httpAPI.mockResolvedValue(newData)

    const result = await history_store.download(1)
    expect(result).toBe(true)

    const state = get(history_store)
    // Should have deduplicated and sorted
    expect(state).toHaveLength(2)
    // Sorted by time descending
    expect(state[0].time).toBe('2024-01-02T10:00:00Z')
    expect(state[1].time).toBe('2024-01-01T08:00:00Z')
  })

  it('should return false on download error', async () => {
    httpAPI.mockResolvedValue('error')
    const result = await history_store.download(0)
    expect(result).toBe(false)
  })

  it('should return false on error msg', async () => {
    httpAPI.mockResolvedValue({ msg: 'error' })
    const result = await history_store.download(0)
    expect(result).toBe(false)
  })
})
