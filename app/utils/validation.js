export const required = value => value ? undefined : 'Required';

export const minLength = min => value =>
  value && value.length < min ? `Must be at least ${min}` : undefined;

export const minLength8 = minLength(8);

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;

export const passwordsMatch = (value, allValues) => 
  value !== allValues.password ? 'Passwords don\'t match' : undefined;