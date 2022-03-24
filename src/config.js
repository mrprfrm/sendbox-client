export const TIME_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;
export const BROKER_URL = process.env.BROKER_URL || 'ws://127.0.0.1:8000/messages';
export const API_URL = process.env.API_URL || 'http://localhost:8000/messages';
