export const getRandomValue = (): string => {
  return [Date.now(), ':', Math.random()].join('')
}