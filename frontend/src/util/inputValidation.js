/**
 * Validates an email address using regex.
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateEmail (email) {
  const regexPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (regexPattern.test(email));
}
