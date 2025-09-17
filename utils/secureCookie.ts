import * as SecureStore from 'expo-secure-store';

const COOKIE_KEY = 'session_cookie';

export async function saveCookie(cookieValue: string) {
  try {
    await SecureStore.setItemAsync(COOKIE_KEY, cookieValue, {
      keychainService: COOKIE_KEY, // iOS
    });
  } catch (error) {
    console.error('Error saving cookie', error);
  }
}

export async function getCookie(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(COOKIE_KEY);
  } catch (error) {
    console.error('Error retrieving cookie', error);
    return null;
  }
}

export async function deleteCookie() {
  try {
    await SecureStore.deleteItemAsync(COOKIE_KEY);
  } catch (error) {
    console.error('Error deleting cookie', error);
  }
}
