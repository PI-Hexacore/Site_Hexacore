const { freteGratis } = require('./teste');

test('freteGratis é verdadeiro para 200', () => {
  expect(freteGratis(200)).toBeTruthy();
});

test('freteGratis é falso para 149', () => {
  expect(freteGratis(149)).toBeFalsy();
});
