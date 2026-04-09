"use client";

import { useEffect, useState } from "react";

interface GolfHour {
  hour: number;
  temp: number;
  wind: number;
  rainChance: number;
  condition: string;
  emoji: string;
}

interface GolfWeatherData {
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    emoji: string;
    wind: number;
    humidity: number;
  };
  high: number;
  low: number;
  sunrise: string;
  sunset: string;
  golfHours: GolfHour[];
  date: string;
}

const WEATHER_CODES: Record<number, { label: string; emoji: string }> = {
  0: { label: "Clear sky", emoji: "☀️" },
  1: { label: "Mainly clear", emoji: "🌤️" },
  2: { label: "Partly cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Foggy", emoji: "🌫️" },
  48: { label: "Rime fog", emoji: "🌫️" },
  51: { label: "Light drizzle", emoji: "🌦️" },
  53: { label: "Drizzle", emoji: "🌧️" },
  55: { label: "Dense drizzle", emoji: "🌧️" },
  61: { label: "Light rain", emoji: "🌦️" },
  63: { label: "Rain", emoji: "🌧️" },
  65: { label: "Heavy rain", emoji: "🌧️" },
  71: { label: "Light snow", emoji: "🌨️" },
  73: { label: "Snow", emoji: "❄️" },
  75: { label: "Heavy snow", emoji: "❄️" },
  80: { label: "Rain showers", emoji: "🌦️" },
  81: { label: "Moderate showers", emoji: "🌧️" },
  82: { label: "Heavy showers", emoji: "⛈️" },
  95: { label: "Thunderstorm", emoji: "⛈️" },
  96: { label: "T-storm w/ hail", emoji: "⛈️" },
  99: { label: "T-storm w/ heavy hail", emoji: "⛈️" },
};

async function fetchWeather(): Promise<GolfWeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: "41.5868",
      longitude: "-93.625",
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
      hourly: "temperature_2m,precipitation_probability,wind_speed_10m,weather_code",
      daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      timezone: "America/Chicago",
      forecast_days: "1",
    });

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) return null;
    const d = await res.json();

    const code = d.current.weather_code as number;
    const cond = WEATHER_CODES[code] ?? { label: "Unknown", emoji: "🌡️" };

    const golfHours = d.hourly.time
      .map((t: string, i: number) => {
        const hour = parseInt(t.split("T")[1].split(":")[0], 10);
        const hCode = d.hourly.weather_code[i] as number;
        const hCond = WEATHER_CODES[hCode] ?? { label: "?", emoji: "🌡️" };
        return {
          hour,
          temp: Math.round(d.hourly.temperature_2m[i]),
          wind: Math.round(d.hourly.wind_speed_10m[i]),
          rainChance: d.hourly.precipitation_probability[i],
          condition: hCond.label,
          emoji: hCond.emoji,
        };
      })
      .filter((h: GolfHour) => h.hour >= 6 && h.hour <= 18);

    const sunrise = d.daily.sunrise[0].split("T")[1];
    const sunset = d.daily.sunset[0].split("T")[1];

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "America/Chicago",
    });

    return {
      current: {
        temp: Math.round(d.current.temperature_2m),
        feelsLike: Math.round(d.current.apparent_temperature),
        condition: cond.label,
        emoji: cond.emoji,
        wind: Math.round(d.current.wind_speed_10m),
        humidity: d.current.relative_humidity_2m,
      },
      high: Math.round(d.daily.temperature_2m_max[0]),
      low: Math.round(d.daily.temperature_2m_min[0]),
      sunrise,
      sunset,
      golfHours,
      date,
    };
  } catch {
    return null;
  }
}

export default function GolfWeather() {
  const [weather, setWeather] = useState<GolfWeatherData | null>(null);

  useEffect(() => {
    fetchWeather().then(setWeather);
  }, []);

  if (!weather) return null;

  return (
    <section className="mt-7 rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-5 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[24px] font-semibold text-[#2A302A]">
          {weather.current.emoji} Today&rsquo;s Golf Weather
        </h2>
        <span className="text-[13px] text-[#52514A]">{weather.date}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#D6DACE] bg-[#FBF8F2] px-4 py-3 text-center">
          <div className="text-[28px] font-bold text-[#2A302A]">{weather.current.temp}°F</div>
          <div className="text-[13px] text-[#52514A]">Feels {weather.current.feelsLike}°F</div>
        </div>
        <div className="rounded-2xl border border-[#D6DACE] bg-[#FBF8F2] px-4 py-3 text-center">
          <div className="text-[16px] font-semibold text-[#2A302A]">{weather.current.condition}</div>
          <div className="text-[13px] text-[#52514A]">H: {weather.high}° / L: {weather.low}°</div>
        </div>
        <div className="rounded-2xl border border-[#D6DACE] bg-[#FBF8F2] px-4 py-3 text-center">
          <div className="text-[16px] font-semibold text-[#2A302A]">{weather.current.wind} mph</div>
          <div className="text-[13px] text-[#52514A]">Wind</div>
        </div>
        <div className="rounded-2xl border border-[#D6DACE] bg-[#FBF8F2] px-4 py-3 text-center">
          <div className="text-[13px] text-[#52514A]">☀️ {weather.sunrise}</div>
          <div className="text-[13px] text-[#52514A]">🌅 {weather.sunset}</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-[14px] font-semibold text-[#2A302A]">Tee Time Forecast</h3>
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
          {weather.golfHours
            .filter((h) => h.hour >= 7 && h.hour <= 18)
            .map((h) => (
              <div
                key={h.hour}
                className="rounded-xl border border-[#D6DACE] bg-[#FBF8F2] px-2 py-2 text-center"
              >
                <div className="text-[12px] font-medium text-[#52514A]">
                  {h.hour > 12 ? h.hour - 12 + "p" : h.hour + "a"}
                </div>
                <div className="text-[14px]">{h.emoji}</div>
                <div className="text-[14px] font-semibold text-[#2A302A]">{h.temp}°</div>
                <div className="text-[11px] text-[#52514A]">{h.wind}mph</div>
                {h.rainChance > 10 && (
                  <div className="text-[11px] text-[#6B8F71]">{h.rainChance}%💧</div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
