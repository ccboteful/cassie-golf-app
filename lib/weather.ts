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

// Des Moines Golf & Country Club coordinates
const LAT = 41.5868;
const LON = -93.625;

export interface GolfWeather {
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
  golfHours: {
    hour: number;
    temp: number;
    wind: number;
    rainChance: number;
    condition: string;
    emoji: string;
  }[];
  date: string;
}

export async function getGolfWeather(): Promise<GolfWeather | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(LAT));
    url.searchParams.set("longitude", String(LON));
    url.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code"
    );
    url.searchParams.set(
      "hourly",
      "temperature_2m,precipitation_probability,wind_speed_10m,weather_code"
    );
    url.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,sunrise,sunset"
    );
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("timezone", "America/Chicago");
    url.searchParams.set("forecast_days", "1");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
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
      .filter((h: { hour: number }) => h.hour >= 6 && h.hour <= 18);

    const sunrise = d.daily.sunrise[0].split("T")[1];
    const sunset = d.daily.sunset[0].split("T")[1];

    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
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
