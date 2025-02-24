const { test, expect } = require('@playwright/test');

test('Проверка лендинг-страницы на ошибки', async ({ page }) => {
  // Переходим на страницу
  await page.goto('https://polis812.github.io/vacuu/');

  // Проверка 1: Страница загружается без ошибок в консоли
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  await page.waitForLoadState('networkidle');
  expect(consoleErrors.length).toBe(0);

  // Проверка 2: Все изображения загружаются корректно
  const images = await page.$$eval('img', imgs => imgs.map(img => img.naturalWidth));
  images.forEach(width => expect(width).toBeGreaterThan(0));

  // Проверка 3: Форма обратной связи валидирует email
  await page.fill('#email', 'invalid-email');
  await page.click('#submit-button');
  const emailError = await page.$('#email-error');
  expect(emailError).not.toBeNull();

  // Проверка 4: Ссылка на раздел "Отзывы" работает
  await page.click('a[href="#reviews"]');
  const reviewsSection = await page.$('#reviews');
  expect(reviewsSection).not.toBeNull();

  // Проверка 5: Кнопка "Купить" адаптируется под мобильные устройства
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  const buyButton = await page.$('#buy-button');
  const buttonSize = await buyButton.boundingBox();
  expect(buttonSize.width).toBeLessThanOrEqual(375);
});
