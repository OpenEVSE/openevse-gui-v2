import { describe, it, expect, beforeEach, vi } from 'vitest'

// We need to mock promise-batching-queue before importing queue.js
vi.mock('promise-batching-queue', () => ({
  PromiseBatcher: {
    newSerialQueue: () => ({
      queue: vi.fn((fn) => fn())
    })
  }
}))

// Import a fresh module for each test
let SerialQueueModule

beforeEach(async () => {
  vi.resetModules()
  SerialQueueModule = await import('../queue.js')
})

describe('SerialQueue', () => {
  it('should export a default serialQueue instance', () => {
    expect(SerialQueueModule.default).toBeDefined()
    expect(SerialQueueModule.serialQueue).toBeDefined()
    expect(SerialQueueModule.default).toBe(SerialQueueModule.serialQueue)
  })

  it('should have add, pause, and resume methods', () => {
    const queue = SerialQueueModule.serialQueue
    expect(typeof queue.add).toBe('function')
    expect(typeof queue.pause).toBe('function')
    expect(typeof queue.resume).toBe('function')
  })

  it('should execute queued functions when not paused', async () => {
    const queue = SerialQueueModule.serialQueue
    const fn = vi.fn(() => 'result')
    const result = await queue.add(fn)
    expect(fn).toHaveBeenCalled()
    expect(result).toBe('result')
  })

  it('should return false when paused', async () => {
    const queue = SerialQueueModule.serialQueue
    queue.pause()
    const fn = vi.fn()
    const result = await queue.add(fn)
    expect(fn).not.toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('should resume execution after resume is called', async () => {
    const queue = SerialQueueModule.serialQueue
    queue.pause()

    const fn1 = vi.fn()
    await queue.add(fn1)
    expect(fn1).not.toHaveBeenCalled()

    queue.resume()

    const fn2 = vi.fn(() => 'resumed')
    const result = await queue.add(fn2)
    expect(fn2).toHaveBeenCalled()
    expect(result).toBe('resumed')
  })

  it('should start in unpaused state', async () => {
    const queue = SerialQueueModule.serialQueue
    expect(queue.ispaused).toBe(false)
  })

  it('should set ispaused to true on pause', () => {
    const queue = SerialQueueModule.serialQueue
    queue.pause()
    expect(queue.ispaused).toBe(true)
  })

  it('should set ispaused to false on resume', () => {
    const queue = SerialQueueModule.serialQueue
    queue.pause()
    expect(queue.ispaused).toBe(true)
    queue.resume()
    expect(queue.ispaused).toBe(false)
  })
})
