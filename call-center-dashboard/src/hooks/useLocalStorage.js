// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state in localStorage
 * @param {string} key - The key to store the value under in localStorage
 * @param {any} initialValue - The initial value to use if no value is found in localStorage
 * @returns {[any, function]} - A stateful value and a function to update it
 */
export const useLocalStorage = (key, initialValue) => {
  // Get the initial value from localStorage or use the provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue if not found
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when the storedValue changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = 
        typeof storedValue === 'function' 
          ? storedValue(storedValue) 
          : storedValue;
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;