import axios from 'axios'

import * as energyUsageJSON from '../data/energy_usage.json'
import * as renewablesJSON from '../data/renewables.json'

async function getEnergyUsageData(date) {
  if (!date) return energyUsageJSON.default.data.slice(0, 96)
  const results = await axios.get(`http://localhost:5000/api/usage?date=${date}`)
  return results.data.data.slice(0, 96)
}

async function getRenewablesData(date) {
  if (!date) return renewablesJSON.default.data
  const results = await axios.get(`http://localhost:5000/api/supply?date=${date}`)
  return results.data.data
}

async function getCombinedData(date) {
  const energyUsageData = await getEnergyUsageData(date)
  const renewablesData = await getRenewablesData(date)

  let combinedData = []
  energyUsageData.forEach((point, idx) => {
    let hour = parseInt(point.time.slice(0, 2))
    let minuteFraction = parseInt(point.time.slice(3, 5)) / 60
    let newPoint = { 
      Time: hour + minuteFraction, 
      'Renewables (MW)': renewablesData[idx].value, 
      'You (Watts)': point.value 
    }
    combinedData.push(newPoint)
  })
  combinedData.push({
    Time: 24, 
    Renewables: renewablesData[renewablesData.length - 1].value, 
    You: energyUsageData[energyUsageData.length - 1].value 
  })

  console.log('this is the combined data::::::::', combinedData)
  return combinedData
}

export {
  getEnergyUsageData,
  getRenewablesData,
  getCombinedData,
}