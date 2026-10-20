// Muzac Authentication Service (Serverless & Node compatible)

// In-memory user store (persists across warm serverless invocations and local node runs)
const usersDatabase = new Map([
  [
    'listener@muzac.app',
    {
      id: 'usr_demo_1',
      username: 'muzac_listener',
      displayName: 'Hi-Fi Explorer',
      email: 'listener@muzac.app',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      tier: 'Master Studio',
      createdAt: '2026-01-15T00:00:00.000Z',
      listeningHours: 148,
      favoriteGenres: ['Synthwave', 'Indie Alternative', 'Hi-Res Jazz', 'Lo-Fi Chill']
    }
  ]
]);

export function registerUser({ username, email, password, displayName, avatar }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanUsername = String(username || '').trim().toLowerCase();
  
  if (!cleanEmail || !password) {
    throw new Error('Email and password are required');
  }

  if (usersDatabase.has(cleanEmail)) {
    throw new Error('An account with this email already exists');
  }

  // Check username collision
  for (const existing of usersDatabase.values()) {
    if (existing.username.toLowerCase() === cleanUsername) {
      throw new Error('Username is already taken');
    }
  }

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  ];

  const user = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    username: cleanUsername || `user_${Math.random().toString(36).slice(2, 6)}`,
    displayName: displayName || cleanUsername || 'Muzac Listener',
    email: cleanEmail,
    password: String(password),
    avatar: avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    tier: 'Master Studio',
    createdAt: new Date().toISOString(),
    listeningHours: 0,
    favoriteGenres: ['Pop', 'R&B', 'Electronic']
  };

  usersDatabase.set(cleanEmail, user);

  // Return sanitized user (without password)
  const { password: _, ...safeUser } = user;
  const token = `mzc_${Buffer.from(cleanEmail).toString('base64')}_${Date.now()}`;
  return { user: safeUser, token };
}

export function loginUser({ usernameOrEmail, password }) {
  const query = String(usernameOrEmail || '').trim().toLowerCase();
  
  let foundUser = null;
  if (usersDatabase.has(query)) {
    foundUser = usersDatabase.get(query);
  } else {
    for (const u of usersDatabase.values()) {
      if (u.username.toLowerCase() === query) {
        foundUser = u;
        break;
      }
    }
  }

  if (!foundUser || foundUser.password !== String(password)) {
    throw new Error('Invalid username/email or password');
  }

  const { password: _, ...safeUser } = foundUser;
  const token = `mzc_${Buffer.from(foundUser.email).toString('base64')}_${Date.now()}`;
  return { user: safeUser, token };
}

export function getUserByToken(token) {
  if (!token || !token.startsWith('mzc_')) return null;
  try {
    const parts = token.split('_');
    const email = Buffer.from(parts[1], 'base64').toString('ascii');
    const user = usersDatabase.get(email);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
}
