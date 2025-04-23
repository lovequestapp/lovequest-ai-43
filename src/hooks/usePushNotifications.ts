
import { useEffect } from 'react';

const usePushNotifications = () => {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === "granted") {
      return new Notification(title, options);
    }
  };

  return { showNotification };
};

export default usePushNotifications;
