export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
    new Date(date)
  );

  return formattedDate;
};
