import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { environment } from '../../../environments/environment.development';

/**
 * Registra el dispositivo en Firebase Cloud Messaging y entrega el token al
 * backend, que lo guarda en el usuario autenticado.
 *
 * Todo el trabajo esta protegido tras isPlatformBrowser: la aplicacion usa SSR
 * y en el render del servidor no existen window, navigator ni Notification.
 */
@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  /** Ultimo mensaje recibido con la app en primer plano. */
  public readonly foregroundMessage = signal<{ title: string; body: string; link?: string } | null>(null);

  /** Estado del permiso del navegador, para poder mostrarlo en la interfaz. */
  public readonly permission = signal<NotificationPermission | 'unsupported'>('default');

  private messaging: Messaging | null = null;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Pide permiso, obtiene el token de FCM y lo envia al backend.
   *
   * Conviene llamarla al iniciar sesion y tambien al restaurar una sesion
   * existente: FCM rota el token sin avisar y la unica forma fiable de
   * mantenerlo al dia es volver a pedirlo en cada arranque.
   *
   * Nunca lanza: un fallo aqui no debe impedir el uso de la aplicacion.
   */
  async registerDevice(): Promise<string | null> {
    if (!this.isBrowser) {
      return null;
    }

    try {
      if (!(await isSupported())) {
        this.permission.set('unsupported');
        console.info('[Push] Este navegador no soporta Firebase Messaging.');
        return null;
      }

      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        this.permission.set('unsupported');
        return null;
      }

      const permission = await Notification.requestPermission();
      this.permission.set(permission);

      if (permission !== 'granted') {
        console.info('[Push] El usuario no concedio permiso de notificaciones.');
        return null;
      }

      // Registramos el service worker a mano y se lo pasamos a getToken. Si no,
      // el SDK busca /firebase-messaging-sw.js por su cuenta y en algunos
      // navegadores falla silenciosamente cuando ya hay otro worker registrado.
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(this.getMessaging(), {
        vapidKey: environment.firebaseVapidKey,
        serviceWorkerRegistration: registration
      });

      if (!token) {
        console.warn('[Push] Firebase no devolvio token.');
        return null;
      }

      await this.sendTokenToBackend(token);
      this.listenForForegroundMessages();

      return token;
    } catch (error) {
      // Sin token no hay notificaciones, pero la aplicacion sigue funcionando.
      console.error('[Push] No se pudo registrar el dispositivo:', error);
      return null;
    }
  }

  /**
   * Mensajes que llegan con la pestana visible. El service worker no los toca:
   * en primer plano el navegador no muestra nada por su cuenta, asi que la
   * aplicacion decide que hacer con ellos.
   */
  private listenForForegroundMessages(): void {
    onMessage(this.getMessaging(), (payload) => {
      this.foregroundMessage.set({
        title: payload.notification?.title ?? 'Tech Solutions',
        body: payload.notification?.body ?? '',
        link: payload.fcmOptions?.link
      });
    });
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    // El interceptor de autenticacion adjunta el Bearer, asi que esta llamada
    // solo funciona con sesion iniciada.
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/me/fcm-token`, { fcm_token: token })
    );
  }

  /** Reutiliza la app de Firebase si ya fue inicializada (evita duplicarla). */
  private getMessaging(): Messaging {
    if (!this.messaging) {
      const app: FirebaseApp = getApps().length ? getApp() : initializeApp(environment.firebase);
      this.messaging = getMessaging(app);
    }

    return this.messaging;
  }
}
