interface WeatherProps {
  location: string;
  weather: string;
  temperature: number;
  humidity: number;
}

export function Weather({ location, weather, temperature, humidity }: WeatherProps) {
  const weatherEmoji: Record<string, string> = {
    Sunny: '☀️',
    'Partly Cloudy': '⛅',
    Cloudy: '☁️',
    Rainy: '🌧️',
    Foggy: '🌫️',
    Snowy: '❄️',
    Stormy: '⛈️',
  };

  const emoji = weatherEmoji[weather] || '🌤️';

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{location}</h3>
          <p className="text-blue-100 text-sm">{weather}</p>
        </div>
        <span className="text-5xl">{emoji}</span>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-6xl font-bold">{temperature}</span>
        <span className="text-2xl mb-2">°F</span>
      </div>

      <div className="flex items-center gap-2 text-blue-100">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
        <span>Humidity: {humidity}%</span>
      </div>
    </div>
  );
}
