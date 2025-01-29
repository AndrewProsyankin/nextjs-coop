import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const BANK_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';
const RATES_FILE = path.join(process.cwd(), 'tmp/currency_rates.json');

async function fetchRates() {
  try {
    const response = await axios.get(BANK_URL);
    if (response.status === 200) {
      console.log('Курсы валют успешно получены с сайта банка.');
      return response.data;
    } else {
      console.error(`Ошибка при загрузке данных: статус ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Ошибка соединения с сайтом банка:', error);
    return null;
  }
}

cron.schedule('0 0 * * *', async () => {
  console.log('Обновление курсов валют запущено...');
  const rates = await fetchRates();
  if (rates) {
    try {
      fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), 'utf8');
      console.log(`Курсы валют обновлены и сохранены в ${RATES_FILE}`);
    } catch (fileError) {
      console.error('Ошибка при сохранении файла с курсами валют:', fileError);
    }
  } else {
    console.error('Курсы валют не были обновлены из-за ошибки.');
  }
});
