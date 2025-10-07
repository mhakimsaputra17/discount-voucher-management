export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateForInput = (dateString: string): string => {
  return dateString.split('T')[0];
};

export const isExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};