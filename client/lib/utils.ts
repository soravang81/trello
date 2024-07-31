import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getTimeDifference = (time: Date | string): string => {
  const timeDate = typeof time === 'string' ? new Date(time) : time;

  const timeDifference = Date.now() - timeDate.getTime();

  const minutes = Math.floor(timeDifference / (1000 * 60));

  if (minutes < 1) {
    return 'now';
  }
  else if (minutes < 5) {
    return 'few mins ago';
  }
  else if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  }
  else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} hr${Math.floor(minutes / 60) > 1 ? 's' : ''} ago`;
  }
  else {
    return `${Math.floor(minutes / 1440)}d${Math.floor(minutes / 1440) > 1 ? 's' : ''} ago`;
  }
};

export const getGreeting = (): string => {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return "Good Morning";
  } else if (hours < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

