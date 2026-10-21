import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchWeather } from '../src/utils/weatherApi.ts';

const weather = () => ({
    current: { temperature_2m: 23, weather_code: 0, is_day: 1 },
    daily: {
        time: ['2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'],
        temperature_2m_min: [10, 11, 12, 13, 14],
        temperature_2m_max: [20, 21, 22, 23, 24],
        weather_code: [0, 1, 2, 3, 61]
    }
});
const air = () => ({ current: { pm10: 16, pm2_5: 8 } });
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
const isAir = (input: unknown) => String(input).includes('air-quality-api.');

test('an air-quality HTTP failure preserves weather and forecast', async t => {
    t.mock.method(globalThis, 'fetch', async (input: unknown) =>
        isAir(input) ? json(air(), 503) : json(weather()));
    const result = await fetchWeather(35.87, 128.60);
    assert.equal(result.current?.temperature, 23);
    assert.deepEqual(result.forecast.map(day => [day.minTemp, day.maxTemp]), [[11, 21], [12, 22], [13, 23], [14, 24]]);
    assert.equal(result.airQuality, null);
});

test('a weather HTTP failure preserves the independent air-quality observation', async t => {
    t.mock.method(globalThis, 'fetch', async (input: unknown) =>
        isAir(input) ? json(air()) : json(weather(), 503));
    const result = await fetchWeather(35.87, 128.60);
    assert.equal(result.current, null);
    assert.deepEqual(result.forecast, []);
    assert.deepEqual(result.airQuality, { pm10: 16, pm25: 8, level: 'Good' });
});

test('network failures contain no fabricated observations', async t => {
    t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('offline'); });
    assert.deepEqual(await fetchWeather(35.87, 128.60), { current: null, airQuality: null, forecast: [] });
});

test('null measurements are unavailable, not zero degrees or good air', async t => {
    const missingWeather = weather();
    const missingAir = air();
    t.mock.method(globalThis, 'fetch', async (input: unknown) => isAir(input)
        ? json({ ...missingAir, current: { ...missingAir.current, pm10: null } })
        : json({ ...missingWeather, current: { ...missingWeather.current, temperature_2m: null } }));
    assert.deepEqual(await fetchWeather(35.87, 128.60), { current: null, airQuality: null, forecast: [] });
});

test('measured zero remains a valid observation', async t => {
    const zeroWeather = weather();
    zeroWeather.current.temperature_2m = 0;
    t.mock.method(globalThis, 'fetch', async (input: unknown) => isAir(input)
        ? json({ current: { pm10: 0, pm2_5: 0 } }) : json(zeroWeather));
    const result = await fetchWeather(35.87, 128.60);
    assert.equal(result.current?.temperature, 0);
    assert.deepEqual(result.airQuality, { pm10: 0, pm25: 0, level: 'Good' });
});
