export const logger = (initDelay = 50): ((log: string) => void) => {
  let count = 0;

  return (log: string) => {
    count++;

    if (count > initDelay) {
      count = 0;
      console.log(log);
    }
  };
};
