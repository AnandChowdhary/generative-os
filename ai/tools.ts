import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }: { location: string }) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock weather data - in production, call a real weather API
    const mockWeatherData: Record<
      string,
      { weather: string; temperature: number; humidity: number }
    > = {
      'new york': { weather: 'Partly Cloudy', temperature: 72, humidity: 65 },
      'san francisco': { weather: 'Foggy', temperature: 58, humidity: 85 },
      london: { weather: 'Rainy', temperature: 52, humidity: 90 },
      tokyo: { weather: 'Sunny', temperature: 78, humidity: 55 },
      paris: { weather: 'Cloudy', temperature: 62, humidity: 70 },
      sydney: { weather: 'Sunny', temperature: 82, humidity: 45 },
    };

    const normalizedLocation = location.toLowerCase();
    const data = mockWeatherData[normalizedLocation] || {
      weather: 'Sunny',
      temperature: 75,
      humidity: 60,
    };

    return {
      ...data,
      location,
    };
  },
});

export const tools = {
  displayWeather: weatherTool,
};
