import * as energyUsageJSON from '../data/energy_usage.json';
import * as renewablesJSON from '../data/renewables.json';

function getEnergyUsageData() {
  return energyUsageJSON.default.data.slice(0, 96);
}

function getRenewablesData() {
  return renewablesJSON.default.data;
}

function getCombinedData() {
  const energyUsageData = getEnergyUsageData();
  const renewablesData = getRenewablesData();
  let combinedData = [];
  energyUsageData.forEach((point, idx) => {
    let hour = parseInt(point.time.slice(0, 2));
    let minuteFraction = parseInt(point.time.slice(3, 5)) / 60;
    let newPoint = { 
      Time: hour + minuteFraction, 
      'Renewables (MW)': renewablesData[idx].value, 
      'You (Watts)': point.value 
    };
    combinedData.push(newPoint);
  });
  combinedData.push({
    Time: 24, 
    Renewables: renewablesData[renewablesData.length - 1].value, 
    You: energyUsageData[energyUsageData.length - 1].value 
  });
  return combinedData;
}

export {
  getEnergyUsageData,
  getRenewablesData,
  getCombinedData,
};