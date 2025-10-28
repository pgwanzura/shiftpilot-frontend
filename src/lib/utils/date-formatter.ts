export const formatDate = (date: Date, locale: string = 'en-GB'): string => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date, locale: string = 'en-GB'): string => {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export const formatDateTimeRange = (startDate: Date, endDate: Date): string => {
  const date = formatDate(startDate);
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  return `${date} • ${startTime} - ${endTime}`;
};

export const formatShiftTime = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return formatDateTimeRange(start, end);
};
