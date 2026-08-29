export const environment = {
  production: true,
  apiUrl: 'https://api.techsolutions.management/api',

  // Configuracion web de Firebase.
  // Firebase Console -> Configuracion del proyecto -> Tus apps -> App web.
  // Estos valores NO son secretos: viajan al navegador de todas formas.
  // Si cambias algo aqui, cambialo tambien en public/firebase-messaging-sw.js,
  // que es un archivo aparte y no puede leer este.
  firebase: {
    apiKey: 'AIzaSyDNuk1NqRcvD1jkWClM3PfjNruCha6QVOU',
    authDomain: 'tech-solutions-app-172c7.firebaseapp.com',
    projectId: 'tech-solutions-app-172c7',
    storageBucket: 'tech-solutions-app-172c7.firebasestorage.app',
    messagingSenderId: '169794000442',
    appId: '1:169794000442:web:e6367f94eb30f44587c703'
  },

  // Firebase Console -> Configuracion del proyecto -> Cloud Messaging ->
  // Certificados push web -> Generar par de claves. Es la clave PUBLICA.
  // Sin ella getToken() falla y no llega ninguna notificacion.
  firebaseVapidKey: 'BAq5NEnArtIuIzh4dLezYqzVtEg5vaQeumsOH7NlhhvJBsOu4uOHGRoxWxMVTUeYxJN8riAVFJsoLIjQczvhqoM'
};
