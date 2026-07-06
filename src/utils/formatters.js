import { formatDistanceToNow, format, isValid } from 'date-fns';

/**
 * Returns a human readable "time ago" string, e.g. "3 hours ago".
 * Falls back gracefully if the date is invalid or missing.
 */
export function timeAgo(dateString) {
  if (!dateString) return 'Unknown time';
  const date = new Date(dateString);
  if (!isValid(date)) return 'Unknown time';
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Returns a nicely formatted date, e.g. "July 4, 2026".
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (!isValid(date)) return '';
  return format(date, 'MMMM d, yyyy');
}

/**
 * Estimates reading time in minutes based on word count (avg 200 wpm).
 */
export function estimateReadingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/**
 * Truncates text to a max length, adding an ellipsis if needed.
 */
export function truncate(text = '', maxLength = 120) {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * Returns today's date formatted nicely, used for the live date display.
 */
export function getTodayFormatted() {
  return format(new Date(), 'EEEE, MMMM d, yyyy');
}
