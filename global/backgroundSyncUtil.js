import * as BackgroundFetch from 'expo-background-fetch'

export const createBackgroundSyncFunction = ({
  popStoredRiskData,
  getSalts,
  getDeviceId,
  submitRiskMap,
  onError,
  hashFunction,
}) => async () => {
  try {
    var riskPointsHash = await popStoredRiskData()
    /**
     * @type {Array<RiskDataPoint>}
     */
    var riskPoints = Object.values(riskPointsHash)
    if (!riskPoints.length)
      return BackgroundFetch.Result.NoData
    var finalHashes = []
    // Group risk points by pre salt hashes
    var saltGroups = groupBy(riskPoints, 'preSaltHash')
    await Promise.all(Object.keys(saltGroups).map(async preSaltHash => {
      var saltDtos = saltGroups[preSaltHash]
      var salts = await getSalts(preSaltHash, saltDtos) 
      await Promise.all(saltDtos.map(async (dto, i) => {
        var { success, hash: salt, error } = salts[i]
        if (!success){
          Sentry.captureMessage(Sentry.captureMessage(error))
          return BackgroundFetch.Result.Failed
        }
        var { timePassedSinceExposure, hash } = dto
        var saltedHash = await hashFunction(hash + '-' + salt)
        finalHashes.push({ hash: saltedHash, timePassedSinceExposure })
      }))
    }))
    var deviceId = await getDeviceId()
    await submitRiskMap(deviceId, finalHashes)
    return BackgroundFetch.Result.NewData
  } catch (error) {
    if (!onError)
      throw error
    onError(error)
    return BackgroundFetch.Result.Failed
  }
}

function groupBy(arr, key) {
  var obj = {}
  arr.forEach(a => {
    var val = a[key]
    obj[val] = obj[val] || []
    obj[val].push(a)
  })
  return obj
}
