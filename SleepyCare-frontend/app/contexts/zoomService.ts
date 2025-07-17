import { url } from "../constants";

export const checkZoomConnection = async (): Promise<{ connected: boolean; signupLink?: string }> => {
    try {
      const res = await fetch(url+'/auth/me/isRegistered'); // יש להחליף לכתובת הנכונה
      if (res.status === 200) {
        return { connected: true };
      } else if (res.status === 404) {
        const data = await res.json();
        return { connected: false, signupLink: data.authenticate };
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      console.error('Zoom check failed', err);
      return { connected: false };
    }
  };
  