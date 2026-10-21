import type { District } from '../types';

const imagesUrl = `${import.meta.env.BASE_URL}images/`;

export const districts: District[] = [
    {
        id: 'daegu',
        name: '대구',
        image: `${imagesUrl}daegu.png`,
        video: `${imagesUrl}daegu.mp4`,
        lat: 35.8714,
        lon: 128.6014
    },
    {
        id: 'suseong-gu',
        name: '수성구',
        image: `${imagesUrl}daegu_수성구.png`,
        video: `${imagesUrl}daegu_수성구.mp4`,
        lat: 35.8580,
        lon: 128.6306
    },
    {
        id: 'jing-gu',
        name: '중구',
        image: `${imagesUrl}daegu_중구.png`,
        video: `${imagesUrl}daegu_중구.mp4`,
        lat: 35.8693,
        lon: 128.6062
    },
    {
        id: 'dong-gu',
        name: '동구',
        image: `${imagesUrl}daegu_동구.png`,
        video: `${imagesUrl}daegu_동구.mp4`,
        lat: 35.8865,
        lon: 128.6355
    },
    {
        id: 'seo-gu',
        name: '서구',
        image: `${imagesUrl}daegu_서구.png`,
        video: `${imagesUrl}daegu_서구.mp4`,
        lat: 35.8717,
        lon: 128.5591
    },
    {
        id: 'nam-gu',
        name: '남구',
        image: `${imagesUrl}daegu_남구.png`,
        video: `${imagesUrl}daegu_남구.mp4`,
        lat: 35.8460,
        lon: 128.5977
    },
    {
        id: 'buk-gu',
        name: '북구',
        image: `${imagesUrl}daegu_북구.png`,
        video: `${imagesUrl}daegu_북구.mp4`,
        lat: 35.8906,
        lon: 128.5828
    },
    {
        id: 'dalseo-gu',
        name: '달서구',
        image: `${imagesUrl}daegu_달서구.png`,
        video: `${imagesUrl}daegu_달서구.mp4`,
        lat: 35.8298,
        lon: 128.5326
    },
    {
        id: 'dalseong-gun',
        name: '달성군',
        image: `${imagesUrl}daegu_달성군.png`,
        video: `${imagesUrl}daegu_달성군.mp4`,
        lat: 35.7746,
        lon: 128.4314
    },
    {
        id: 'gunwi-gun',
        name: '군위군',
        image: `${imagesUrl}daegu_군위군.png`,
        video: `${imagesUrl}daegu_군위군.mp4`,
        lat: 36.2428,
        lon: 128.5728
    }
];
