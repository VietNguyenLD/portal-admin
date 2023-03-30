export function parseISOString(date: string) {
  const arrNumber = date.split('/');
  const ISODate = new Date(
    parseInt(arrNumber[2]),
    parseInt(arrNumber[1]) - 1,
    parseInt(arrNumber[0]),
  );

  return ISODate.toISOString();
}
