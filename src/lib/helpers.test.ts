import {
  areEqualFloats,
  formatDailyTime,
  formatHourlyTime, geoNames2Location,
  getTodayWeatherData, mergeArraysBy, objectToURLQuery,
  weatherCode2MDI,
  weatherCode2Str
} from "./helpers";
import moment from "moment-timezone";
import {GeoNamesResource, LocationResource} from "./types";

describe('weatherCode2MDI', () => {
  it('returns the correct MDI icon for weather codes', () => {
    expect(weatherCode2MDI(0)).toBe('mdi-weather-sunny');
    expect(weatherCode2MDI(1)).toBe('mdi-weather-partly-cloudy');
    expect(weatherCode2MDI(2)).toBe('mdi-weather-partly-cloudy');
    expect(weatherCode2MDI(3)).toBe('mdi-weather-partly-cloudy');
    expect(weatherCode2MDI(45)).toBe('mdi-weather-fog');
    expect(weatherCode2MDI(48)).toBe('mdi-weather-fog');
    expect(weatherCode2MDI(51)).toBe('mdi-weather-partly-rainy');
    expect(weatherCode2MDI(53)).toBe('mdi-weather-partly-rainy');
    expect(weatherCode2MDI(55)).toBe('mdi-weather-partly-rainy');
    expect(weatherCode2MDI(56)).toBe('mdi-weather-partly-snowy-rainy');
    expect(weatherCode2MDI(57)).toBe('mdi-weather-partly-snowy-rainy');
    expect(weatherCode2MDI(61)).toBe('mdi-weather-rainy');
    expect(weatherCode2MDI(63)).toBe('mdi-weather-rainy');
    expect(weatherCode2MDI(65)).toBe('mdi-weather-rainy');
    expect(weatherCode2MDI(66)).toBe('mdi-weather-snowy-rainy');
    expect(weatherCode2MDI(67)).toBe('mdi-weather-snowy-rainy');
    expect(weatherCode2MDI(71)).toBe('mdi-weather-snowy-heavy');
    expect(weatherCode2MDI(73)).toBe('mdi-weather-snowy-heavy');
    expect(weatherCode2MDI(75)).toBe('mdi-weather-snowy-heavy');
    expect(weatherCode2MDI(77)).toBe('mdi-weather-partly-snowy');
    expect(weatherCode2MDI(80)).toBe('mdi-weather-pouring');
    expect(weatherCode2MDI(81)).toBe('mdi-weather-pouring');
    expect(weatherCode2MDI(82)).toBe('mdi-weather-pouring');
    expect(weatherCode2MDI(85)).toBe('mdi-weather-snowy');
    expect(weatherCode2MDI(86)).toBe('mdi-weather-snowy');
    expect(weatherCode2MDI(95)).toBe('mdi-weather-lightning-rainy');
    expect(weatherCode2MDI(96)).toBe('mdi-weather-hail');
    expect(weatherCode2MDI(99)).toBe('mdi-weather-hail');
  });

  it('returns an empty string for unknown weather codes', () => {
    const unknownCodes = [-1, 100, 200];
    unknownCodes.forEach(code => {
      expect(weatherCode2MDI(code)).toEqual('');
    });
  });
});

describe('weatherCode2Str', () => {
  it('returns the correct MDI icon for weather codes', () => {
    expect(weatherCode2Str(0)).toBe('Clear sky');
    expect(weatherCode2Str(1)).toBe('Partly cloudy');
    expect(weatherCode2Str(2)).toBe('Partly cloudy');
    expect(weatherCode2Str(3)).toBe('Partly cloudy');
    expect(weatherCode2Str(45)).toBe('Fog');
    expect(weatherCode2Str(48)).toBe('Fog');
    expect(weatherCode2Str(51)).toBe('Drizzle');
    expect(weatherCode2Str(53)).toBe('Drizzle');
    expect(weatherCode2Str(55)).toBe('Drizzle');
    expect(weatherCode2Str(56)).toBe('Freezing Drizzle');
    expect(weatherCode2Str(57)).toBe('Freezing Drizzle');
    expect(weatherCode2Str(61)).toBe('Rain');
    expect(weatherCode2Str(63)).toBe('Rain');
    expect(weatherCode2Str(65)).toBe('Rain');
    expect(weatherCode2Str(66)).toBe('Freezing Rain');
    expect(weatherCode2Str(67)).toBe('Freezing Rain');
    expect(weatherCode2Str(71)).toBe('Snow fall');
    expect(weatherCode2Str(73)).toBe('Snow fall');
    expect(weatherCode2Str(75)).toBe('Snow fall');
    expect(weatherCode2Str(77)).toBe('Snow grains');
    expect(weatherCode2Str(80)).toBe('Rain showers');
    expect(weatherCode2Str(81)).toBe('Rain showers');
    expect(weatherCode2Str(82)).toBe('Rain showers');
    expect(weatherCode2Str(85)).toBe('Snow showers');
    expect(weatherCode2Str(86)).toBe('Snow showers');
    expect(weatherCode2Str(95)).toBe('Thunderstorm');
    expect(weatherCode2Str(96)).toBe('Thunderstorm with hail');
    expect(weatherCode2Str(99)).toBe('Thunderstorm with hail');
  });

  it('returns an empty string for unknown weather codes', () => {
    const unknownCodes = [-1, 100, 200];
    unknownCodes.forEach(code => {
      expect(weatherCode2Str(code)).toEqual('');
    });
  });
});

describe('formatHourlyTime', () => {
  const mockLocation = require('../mocks/location-resource-mock.json');

  it('formats hourly time correctly', () => {
    const mockTime = '2023-08-06T15:00:00';
    const formattedTime = formatHourlyTime(mockTime, mockLocation.timezone);

    const currentTime = moment().tz(mockLocation.timezone);
    const timeMoment = moment(mockTime).tz(mockLocation.timezone);

    let expectedFormattedTime;
    if (timeMoment.isSame(currentTime, 'hour')) {
      expectedFormattedTime = 'Now';
    } else {
      expectedFormattedTime = timeMoment.format('h a');
    }

    expect(formattedTime).toEqual(expectedFormattedTime);
  });

  it('formats hourly time without "Now"', () => {
    const mockTime = '2023-08-06T15:00:00';
    const formattedTime = formatHourlyTime(mockTime, mockLocation.timezone, false);

    const timeMoment = moment(mockTime).tz(mockLocation.timezone);
    const expectedFormattedTime = timeMoment.format('h a');

    expect(formattedTime).toEqual(expectedFormattedTime);
  });
});

describe('formatDailyTime', () => {
  const mockLocation = require('../mocks/location-resource-mock.json');

  it('formats daily time correctly', () => {
    const mockTime = '2023-08-06T15:00:00';
    const formattedTime = formatDailyTime(mockTime, mockLocation.timezone);

    const currentTime = moment().tz(mockLocation.timezone);
    const timeMoment = moment(mockTime).tz(mockLocation.timezone);

    let expectedFormattedTime: string;
    if (timeMoment.isSame(currentTime, 'day')) {
      expectedFormattedTime = 'Today';
    } else {
      expectedFormattedTime = timeMoment.format('ddd');
    }

    expect(formattedTime).toEqual(expectedFormattedTime);
  });
});

describe('getTodayWeatherData', () => {
  const mockLocation = require('../mocks/location-resource-mock.json');

  const mockForecast = require('../mocks/forecast-resource-mock.json');

  it('returns an array of weather locations for today\'s times correctly', () => {
    const format = 'YYYY-MM-DDTHH:mm:ss';
    const momentTimezone = moment().tz(mockForecast.timezone).startOf('hour');

    const data = {
      ...mockForecast,
      hourly: {
        time: [
          momentTimezone.add(0, 'hours').format(format),
          momentTimezone.add(1, 'hours').format(format),
          momentTimezone.add(2, 'hours').format(format),
        ],
        temperature_2m: [20, 22, 19],
        weathercode: [1, 2, 3],
        windspeed_10m: [5, 7, 4],
        relativehumidity_2m: [60, 65, 70]
      }
    };

    const result = getTodayWeatherData(data.hourly, mockLocation.timezone);

    expect(result).toEqual([
      {
        time: data.hourly.time[0],
        temperature_2m: 20,
        weathercode: 1,
        windspeed_10m: 5,
        relativehumidity_2m: 60
      },
      {
        time: data.hourly.time[1],
        temperature_2m: 22,
        weathercode: 2,
        windspeed_10m: 7,
        relativehumidity_2m: 65
      },
      {
        time: data.hourly.time[2],
        temperature_2m: 19,
        weathercode: 3,
        windspeed_10m: 4,
        relativehumidity_2m: 70
      }
    ]);
  });

  it('returns an empty array if there are no today times', () => {
    const format = 'YYYY-MM-DDTHH:mm:ss';
    const momentTimezone = moment().tz(mockForecast.timezone).startOf('hour');

    const data = {
      ...mockForecast,
      hourly: {
        time: [
          momentTimezone.subtract(1, 'days').format(format), // Past day
          momentTimezone.subtract(2, 'days').format(format), // Past day
          momentTimezone.add(2, 'days').format(format), // Future day
        ],
        temperature_2m: [20, 22, 19],
        weathercode: [1, 2, 3],
        windspeed_10m: [5, 7, 4],
        relativehumidity_2m: [60, 65, 70]
      }
    };

    const result = getTodayWeatherData(data.hourly, mockLocation.timezone);
    expect(result).toEqual([]);
  });
});

describe('areEqualFloats', () => {
  test('returns true for equal floats within precision', () => {
    expect(areEqualFloats(0.1 + 0.2, 0.3)).toBe(true);
  });

  test('returns false for unequal floats outside precision', () => {
    expect(areEqualFloats(0.1 + 0.2, 0.31)).toBe(false);
  });

  test('handles custom precision', () => {
    expect(areEqualFloats(0.01 + 0.02, 0.03, 3)).toBe(true);
    expect(areEqualFloats(0.01 + 0.02, 0.031, 3)).toBe(false);
  });

  test('handles negative floats', () => {
    expect(areEqualFloats(-0.1 - 0.2, -0.3)).toBe(true);
    expect(areEqualFloats(-0.1 - 0.2, -0.31)).toBe(false);
  });
});

describe('geoNames2Location', () => {
  const mockGeoNamesResource: GeoNamesResource = {
    recordid: '123',
    fields: {
      cou_name_en: 'United States',
      country_code: 'US',
      geoname_id: '123456',
      feature_code: 'PPL',
      coordinates: [37.7749, -122.4194],
      name: 'San Francisco',
      population: 883305,
      timezone: 'America/Los_Angeles',
    },
  };

  it('should correctly convert GeoNames resource to Location resource', () => {
    const expectedLocationResource: LocationResource = {
      country: 'United States',
      country_code: 'US',
      country_id: '123456',
      feature_code: 'PPL',
      id: '123',
      latitude: 37.7749,
      longitude: -122.4194,
      name: 'San Francisco',
      population: 883305,
      timezone: 'America/Los_Angeles',
    };

    const result = geoNames2Location(mockGeoNamesResource);
    expect(result).toEqual(expectedLocationResource);
  });
});

describe("mergeArraysBy", () => {
  it("should merge arrays based on custom key and comparator", () => {
    interface Element {
      name: string;
      category: string;
    }

    const a: Element[] = [
      { name: "A", category: "X" },
      { name: "B", category: "Y" },
      { name: "C", category: "Z" },
    ];

    const b: Element[] = [
      { name: "B", category: "Y" },
      { name: "C", category: "Z" },
      { name: "D", category: "W" },
    ];

    const keyFn = (element: Element) => `${element.name}-${element.category}`;

    const mergedArray = mergeArraysBy(
      a,
      b,
      keyFn,
      (elementA, elementB) => elementA.name === elementB.name
    );

    // The expected merged array
    const expectedMergedArray: Element[] = [
      { name: "A", category: "X" },
      { name: "B", category: "Y" }, // Chosen from 'b' due to the comparator
      { name: "C", category: "Z" }, // Chosen from 'b' due to the comparator
      { name: "D", category: "W" }, // Added from 'b' since it's not in 'a'
    ];

    expect(mergedArray).toEqual(expectedMergedArray);
  });
});

describe('objectToURLQuery', () => {
  it('should convert an object to a URL query string', () => {
    const input = { key1: 'value1', key2: 'value2' };
    const expected = 'key1=value1&key2=value2';
    const result = objectToURLQuery(input);
    expect(result).toBe(expected);
  });

  it('should handle null values by excluding them from the query string', () => {
    const input = { key1: 'value1', key2: null, key3: 'value3' };
    const expected = 'key1=value1&key3=value3';
    const result = objectToURLQuery(input);
    expect(result).toBe(expected);
  });

  it('should handle an empty object by returning an empty string', () => {
    const input = {};
    const expected = '';
    const result = objectToURLQuery(input);
    expect(result).toBe(expected);
  });
});
