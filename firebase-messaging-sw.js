// firebase-messaging-sw.js
// Этот файл ОБЯЗАТЕЛЬНО должен лежать в корне сайта (там же, где index.html),
// именно под этим именем — Firebase ищет его по фиксированному пути.

importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js');

// ВАЖНО: sender_id ниже нужно заменить на реальный (Firebase Console -> Project Settings -> Cloud Messaging -> Sender ID)
firebase.initializeApp({
  apiKey: "AIzaSyCYptPoeocCbngAMfG_R-t32FOfIGJY13s",
  projectId: "dima256",
  messagingSenderId: "208400853144",
  appId: "1:208400853144:web:78eb608f5aacd57e8848ed"
});

const messaging = firebase.messaging();

// Показываем уведомление, когда сайт закрыт/не в фокусе
// ВАЖНО: читаем именно из payload.data, а не payload.notification —
// если бы в сообщении было поле notification, браузер показал бы его САМ,
// а потом ещё раз показался бы наш собственный вызов ниже — уведомление дублировалось бы.
messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || 'Бурмалда';
  const body = payload.data?.body || '';
  self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
  });
});

// Клик по уведомлению открывает сайт
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
