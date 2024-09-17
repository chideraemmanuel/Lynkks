import { v4 as uuid } from 'uuid';

// Helper function to get a cookie value by name
export function getCookie(cname: string) {
  const nameEQ = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArr = decodedCookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) == 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

export const setCookie = (name: string, value: string | number) => {
  // const value = uuid();

  // Set the cookie with a 30-minute expiration
  const date = new Date();
  date.setTime(date.getTime() + 30 * 60 * 1000); // 30 minutes in milliseconds
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + value + expires + '; path=/';
};

export function checkAndSetCookie(name: string) {
  // Check if the cookie exists
  const cookie = getCookie(name);
  if (cookie === null) {
    // Generate a UUID as the value
    const value = uuid();

    // Set the cookie with a 30-minute expiration
    const date = new Date();
    date.setTime(date.getTime() + 30 * 60 * 1000); // 30 minutes in milliseconds
    const expires = '; expires=' + date.toUTCString();
    document.cookie = name + '=' + value + expires + '; path=/';
  }
}
