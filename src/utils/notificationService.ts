// Browser Push Notification service for Prayer Times

import { PrayerName } from '../types/prayer';
import { soundManager } from './audioService';

const PRAYER_DISPLAY_NAMES: Record<PrayerName, { name: string; arabic: string }> = {
  imsak: { name: 'Imsak', arabic: 'الإمساك' },
  fajr: { name: 'Subuh', arabic: 'الفجر' },
  sunrise: { name: 'Syuruq', arabic: 'الشروق' },
  dhuhr: { name: 'Dzuhur', arabic: 'الظهر' },
  asr: { name: 'Ashar', arabic: 'العصر' },
  maghrib: { name: 'Maghrib', arabic: 'المغرب' },
  isha: { name: 'Isya', arabic: 'العشاء' },
};

class NotificationService {
  private lastNotifiedKey: string = '';

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  // Trigger notification for a prayer
  notifyPrayerTime({
    prayerKey,
    cityName,
    playAdhanSound = true,
  }: {
    prayerKey: PrayerName;
    cityName: string;
    playAdhanSound?: boolean;
  }): boolean {
    const info = PRAYER_DISPLAY_NAMES[prayerKey];
    const title = `Waktu Sholat ${info.name} Telah Tiba (${info.arabic})`;
    const body = `Telah masuk waktu sholat ${info.name} untuk wilayah ${cityName} dan sekitarnya. Mari tunaikan sholat tepat waktu.`;

    // Audio & vibration
    if (playAdhanSound) {
      soundManager.playAdhanStream();
    }
    soundManager.triggerVibration(200);

    // Browser Notification
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: `prayer-${prayerKey}-${Date.now()}`,
          requireInteraction: true,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return true;
      } catch {
        // Fallback or error in iframe/browser
        return false;
      }
    }

    return false;
  }

  // Send test notification to verify setup
  sendTestNotification(cityName: string): boolean {
    const title = 'Pengingat Sholat Nurul Islam Aktif';
    const body = `Notifikasi browser berhasil diaktifkan untuk wilayah ${cityName}. Anda akan diingatkan setiap waktu sholat tiba.`;

    soundManager.playSuccessChime();
    soundManager.triggerVibration(100);

    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: 'test-notification',
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Check if already notified for this exact prayer today
  hasAlreadyNotified(key: string): boolean {
    return this.lastNotifiedKey === key;
  }

  markAsNotified(key: string) {
    this.lastNotifiedKey = key;
  }
}

export const notificationService = new NotificationService();
