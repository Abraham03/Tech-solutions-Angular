/*
 * Service worker de Firebase Cloud Messaging.
 *
 * DEBE servirse desde la raiz del sitio (/firebase-messaging-sw.js). Vive en
 * public/, que angular.json copia tal cual a la raiz del build. Si estuviera
 * en assets/ su scope seria /assets/ y no podria recibir notificaciones de
 * toda la aplicacion.
 *
 * Un service worker no puede importar el environment de Angular ni usar
 * modulos ES, por eso la configuracion esta duplicada aqui y se cargan los
 * bundles "compat" por importScripts. Si cambias la configuracion en
 * src/environments/, cambiala tambien aqui.
 *
 * Solo maneja los mensajes que llegan con la pestana cerrada o en segundo
 * plano. Con la app en primer plano el mensaje lo recibe onMessage() en
 * PushNotificationsService.
 */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDNuk1NqRcvD1jkWClM3PfjNruCha6QVOU',
  authDomain: 'tech-solutions-app-172c7.firebaseapp.com',
  projectId: 'tech-solutions-app-172c7',
  storageBucket: 'tech-solutions-app-172c7.firebasestorage.app',
  messagingSenderId: '169794000442',
  appId: '1:169794000442:web:e6367f94eb30f44587c703'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // El backend envia data-only: sin bloque 'notification'. Si lo llevara, el
  // SDK pintaria la notificacion por su cuenta ADEMAS de llamar aqui, y el
  // usuario veria el mismo aviso dos veces con iconos distintos.
  // Por eso titulo, cuerpo y enlace viajan dentro de data.
  const data = payload.data || {};
  const link = data.link || '/';

  // Un tag distinto por aviso. Con un tag fijo, cada notificacion nueva
  // REEMPLAZA en silencio a la anterior: sin sonido, sin vibracion y sin
  // banner. El usuario nunca se entera de que llego algo nuevo.
  // Para pagos hay que ver cada uno por separado, asi que se usa el id del
  // pago cuando viene, y si no una marca de tiempo.
  const tag = data.payment_id ? `pago-${data.payment_id}` : `aviso-${Date.now()}`;

  self.registration.showNotification(data.title || 'Tech Solutions', {
    body: data.body || '',
    // 192px y no el favicon de 96: en escritorio y tablets la notificacion
    // muestra el icono a mayor tamano y el de 96 se ve borroso.
    icon: '/icon-192.png',
    // El badge es el icono monocromo pequeno de la barra de estado en Android;
    // el resto de plataformas lo ignoran.
    badge: '/favicon-96x96.png',
    data: { link },
    tag,
    // Si aun asi coincidiera un tag, que vuelva a avisar en vez de sustituir
    // la anterior sin hacer ruido.
    renotify: true,
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const link = (event.notification.data && event.notification.data.link) || '/';

  // Si ya hay una pestana de la app abierta la reutilizamos en vez de abrir
  // otra: de lo contrario cada notificacion dejaria una pestana huerfana.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === link && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(link);
      }

      return undefined;
    })
  );
});
