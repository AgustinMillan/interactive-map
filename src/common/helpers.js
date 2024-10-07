export const excelDateToISO = (excelDate) => {
  console.log(excelDate);
  ("2014-11-30 00:00:00");

  const date = excelDate.slice(0, 10);
  const time = excelDate.slice(11, 19);

  return new Date(`${date}T${time}`).toISOString();
};
