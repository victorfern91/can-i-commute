function isGoodToCommute(temp, rain, wind) {
    return temp >= 7 &&
           rain <= 35 &&
           wind <= 25;
}

export function addCommuteInformation(arr, commuteHours) {
    return arr
    .filter(t => commuteHours.includes(new Date(t.date).getHours()))
    .map(t => ({
        ...t,
        isGoodToCommute: isGoodToCommute(t.temperature, t.rain.probability, t.wind.speed)
    }));
}

export function getInsights(forecast) {
    const morningForecast = forecast.slice(0, (forecast.length / 2) - 1);
    const afternoonForecast = forecast.slice(forecast.length / 2, forecast.length - 1);
    const reportMorning = morningForecast.some(forecast => forecast.isGoodToCommute);
    const reportAfternoon = afternoonForecast.some(forecast => forecast.isGoodToCommute)

    return {
        isSafeToCommute: {
            morning: reportMorning,
            afternoon: reportAfternoon,
            overall: reportMorning && reportAfternoon
        }
    }
}
