export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export function formatDistanceToNow(date) {
  const now = new Date();
  const diffInMilliseconds = now - new Date(date);

  // Переводим миллисекунды в единицы измерения
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} ${pluralize(years, 'год', 'года', 'лет')} назад`;
  } else if (months > 0) {
    return `${months} ${pluralize(months, 'месяц', 'месяца', 'месяцев')} назад`;
  } else if (days > 0) {
    return `${days} ${pluralize(days, 'день', 'дня', 'дней')} назад`;
  } else if (hours > 0) {
    return `${hours} ${pluralize(hours, 'час', 'часа', 'часов')} назад`;
  } else if (minutes > 0) {
    return `${minutes} ${pluralize(minutes, 'минуту', 'минуты', 'минут')} назад`;
  } else {
    return `${seconds} ${pluralize(seconds, 'секунду', 'секунды', 'секунд')} назад`;
  }
}

function pluralize(count, one, few, many) {
  if (count % 10 === 1 && count % 100 !== 11) {
    return one;
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return few;
  } else {
    return many;
  }
}

export function formatLikes(likes) {
  if (likes.length === 0) {
    return 'Нравится: <strong>0</strong>';
  } else if (likes.length === 1) {
    return `Нравится: <strong>${likes[0].name}</strong>`;
  } else {
    return `Нравится: <strong>${likes[0].name}</strong> и еще <strong>${likes.length - 1}</strong>`;
  }
}