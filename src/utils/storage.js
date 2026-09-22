const STORAGE_KEY = 'glassmorphic_auth_users_v1';
const RECENT_LOGIN_KEY = 'glassmorphic_recent_login_v1';

export const INITIAL_SEEDED_USERS = [
  {
    id: 'user-seed-1',
    name: 'Alex Rivers',
    gmail: 'alex.rivers@gmail.com',
    password: 'NovaPass#2026!',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'user-seed-2',
    name: 'Demo User',
    gmail: 'demo.user@gmail.com',
    password: 'GlassVault789',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'user-seed-3',
    name: 'Sarah Connor',
    gmail: 'sarah.design@gmail.com',
    password: 'AuraPrism42',
    createdAt: Date.now() - 86400000 * 1,
  },
];

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_USERS));
      return INITIAL_SEEDED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SEEDED_USERS;
  } catch {
    return INITIAL_SEEDED_USERS;
  }
}

export function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  const normalizedGmail = user.gmail.trim().toLowerCase();

  const existingIndex = users.findIndex(
    (u) => u.gmail.toLowerCase() === normalizedGmail
  );
  if (existingIndex >= 0) {
    users[existingIndex] = {
      ...users[existingIndex],
      name: user.name || users[existingIndex].name,
      password: user.password,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return users[existingIndex];
  }

  const newUser = {
    id: 'user-' + Math.random().toString(36).substring(2, 9),
    name: user.name?.trim() || user.gmail.split('@')[0],
    gmail: normalizedGmail,
    password: user.password,
    createdAt: Date.now(),
  };

  users.unshift(newUser);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return newUser;
}

export function recordRecentLoginEntry(gmail, password) {
  if (!gmail) return;
  const normalizedGmail = gmail.trim().toLowerCase();
  try {
    const data = {
      gmail: normalizedGmail,
      password: password || '',
      updatedAt: Date.now(),
    };
    localStorage.setItem(RECENT_LOGIN_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export function getRecentLoginEntry() {
  try {
    const raw = localStorage.getItem(RECENT_LOGIN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function findUserByGmail(gmail) {
  if (!gmail) return null;
  const normalized = gmail.trim().toLowerCase();
  const users = getRegisteredUsers();

  const foundInUsers = users.find((u) => u.gmail.toLowerCase() === normalized);
  if (foundInUsers) return foundInUsers;

  const recent = getRecentLoginEntry();
  if (recent && recent.gmail.toLowerCase() === normalized && recent.password) {
    return {
      id: 'draft-login-entry',
      name: normalized.split('@')[0],
      gmail: normalized,
      password: recent.password,
      createdAt: Date.now(),
    };
  }

  return null;
}
