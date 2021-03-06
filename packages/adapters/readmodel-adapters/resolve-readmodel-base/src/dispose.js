const dispose = (pool, options = {}) => {
  if (options != null && options.constructor !== Object) {
    throw new Error('Dispose options should be plain object if provided')
  }

  if (pool.disposePromise) {
    return pool.disposePromise
  }

  const { disconnect, drop } = pool
  const disposePromise = (async () => {
    if (Object.keys(options).length > 0) {
      await drop(options)
    }
    await disconnect()

    for (const key of Object.keys(pool)) {
      if (key !== 'disposePromise') {
        delete pool[key]
      }
    }
  })()

  pool.disposePromise = disposePromise
  return disposePromise
}

export default dispose
