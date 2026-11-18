import type { LocalWeatherState, WeatherCondition } from '../types/game';

export function getLocalTimePeriod(hour: number): 'Pagi' | 'Siang' | 'Sore' | 'Malam' {
  if (hour >= 5 && hour < 10) return 'Pagi';
  if (hour >= 10 && hour < 15) return 'Siang';
  if (hour >= 15 && hour < 18) return 'Sore';
  return 'Malam';
}

export function mapWmoToWeather(
  wmoCode: number,
  temperatureC: number
): { condition: WeatherCondition; label: string } {
  if ([95, 96, 99].includes(wmoCode)) {
    return { condition: 'storm', label: 'Hujan Petir' };
  }
  if ((wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) {
    return { condition: 'rain', label: 'Hujan' };
  }
  if ([1, 2, 3, 45, 48].includes(wmoCode)) {
    if (temperatureC >= 32 && wmoCode === 1) {
      return { condition: 'hot', label: 'Panas Cerah' };
    }
    return { condition: 'cloudy', label: 'Berawan' };
  }
  if (temperatureC >= 31) {
    return { condition: 'hot', label: 'Panas Terik' };
  }
  return { condition: 'clear', label: 'Cerah' };
}

function getBrowserCoords(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    const timer = window.setTimeout(() => resolve(null), 3500);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 3400, maximumAge: 600000 }
    );
  });
}

export async function detectRealLocalWeather(): Promise<LocalWeatherState> {
  const now = new Date();
  const localHour = now.getHours() + now.getMinutes() / 60;
  const timePeriod = getLocalTimePeriod(now.getHours());

  try {
    const coords = await getBrowserCoords();
    const qs = coords ? `?lat=${coords.lat.toFixed(4)}&lon=${coords.lon.toFixed(4)}` : '';
    const res = await fetch(`/api/weather${qs}`);
    if (res.ok) {
      const data = (await res.json()) as {
        weatherCode: number;
        temperatureC: number;
        locationLabel: string;
      };
      const mapped = mapWmoToWeather(Number(data.weatherCode ?? 0), Number(data.temperatureC ?? 29));
      return {
        condition: mapped.condition,
        temperatureC: Math.round(Number(data.temperatureC ?? 29)),
        label: mapped.label,
        locationLabel: data.locationLabel || 'Lokasi Lokal',
        timePeriod,
        localHour,
      };
    }
  } catch (err) {
    console.warn('Weather fetch fallback:', err);
  }

  return {
    condition: 'clear',
    temperatureC: 29,
    label: 'Cerah',
    locationLabel: 'Cuaca Lokal',
    timePeriod,
    localHour,
  };
}
