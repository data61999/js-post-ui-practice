import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#66bb6a',
      },
    }).showToast();
  },
  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#f44336',
      },
    }).showToast();
  },
  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#4fc3f7',
      },
    }).showToast();
  },
};
