export default function getFormattedDate(isoDateString) {
  const dateObject = new Date(isoDateString);
  const year = dateObject.getUTCFullYear();
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}