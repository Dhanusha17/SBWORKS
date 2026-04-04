// SB Works — localStorage database layer

const K = {
  USERS: 'sbw_users',
  FREELANCERS: 'sbw_freelancers',
  PROJECTS: 'sbw_projects',
  APPLICATIONS: 'sbw_applications',
  CHATS: 'sbw_chats',
};

export const uid = () => Math.random().toString(36).substr(2,9) + Date.now().toString(36);

const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Seed admin on first load
export const seedAdmin = () => {
  const users = read(K.USERS);
  if (!users.find(u => u.email === 'admin@sbworks.com')) {
    users.push({ id: 'admin001', username: 'Admin', email: 'admin@sbworks.com', password: 'Admin@123', usertype: 'admin', createdAt: new Date().toLocaleDateString() });
    write(K.USERS, users);
  }
};

// ── USERS ──────────────────────────────────────────────
export const getUsers = () => read(K.USERS);
export const getUserById = (id) => read(K.USERS).find(u => u.id === id);
export const getUserByEmail = (email) => read(K.USERS).find(u => u.email === email);
export const addUser = (data) => {
  const users = read(K.USERS);
  const user = { id: uid(), createdAt: new Date().toLocaleDateString(), ...data };
  users.push(user);
  write(K.USERS, users);
  return user;
};
export const deleteUser = (id) => write(K.USERS, read(K.USERS).filter(u => u.id !== id));

// ── FREELANCERS ────────────────────────────────────────
export const getFreelancer = (userId) => read(K.FREELANCERS).find(f => f.userId === userId);
export const createFreelancer = (userId) => {
  const list = read(K.FREELANCERS);
  const f = { id: uid(), userId, skills: [], description: '', currentProjects: [], completedProjects: [], applications: [], funds: 0 };
  list.push(f);
  write(K.FREELANCERS, list);
  return f;
};
export const updateFreelancer = (userId, updates) => {
  const list = read(K.FREELANCERS);
  const i = list.findIndex(f => f.userId === userId);
  if (i > -1) { list[i] = { ...list[i], ...updates }; write(K.FREELANCERS, list); return list[i]; }
};
export const getAllFreelancers = () => read(K.FREELANCERS);

// ── PROJECTS ──────────────────────────────────────────
export const getProjects = () => read(K.PROJECTS);
export const getProject = (id) => read(K.PROJECTS).find(p => p.id === id);
export const addProject = (data) => {
  const list = read(K.PROJECTS);
  const p = { id: uid(), bids: [], bidAmounts: [], status: 'Available', submission: false, submissionAccepted: false, freelancerId: '', freelancerName: '', projectLink: '', manulaLink: '', submissionDescription: '', ...data };
  list.push(p);
  write(K.PROJECTS, list);
  return p;
};
export const updateProject = (id, updates) => {
  const list = read(K.PROJECTS);
  const i = list.findIndex(p => p.id === id);
  if (i > -1) { list[i] = { ...list[i], ...updates }; write(K.PROJECTS, list); return list[i]; }
};

// ── APPLICATIONS ──────────────────────────────────────
export const getApplications = () => read(K.APPLICATIONS);
export const addApplication = (data) => {
  const list = read(K.APPLICATIONS);
  const a = { id: uid(), status: 'Pending', appliedAt: new Date().toLocaleDateString(), ...data };
  list.push(a);
  write(K.APPLICATIONS, list);
  return a;
};
export const updateApplication = (id, updates) => {
  const list = read(K.APPLICATIONS);
  const i = list.findIndex(a => a.id === id);
  if (i > -1) { list[i] = { ...list[i], ...updates }; write(K.APPLICATIONS, list); return list[i]; }
};

// ── CHATS ─────────────────────────────────────────────
export const getChat = (chatId) => {
  const list = read(K.CHATS);
  return list.find(c => c.chatId === chatId) || { chatId, messages: [] };
};
export const sendMessage = (chatId, message) => {
  const list = read(K.CHATS);
  const i = list.findIndex(c => c.chatId === chatId);
  if (i === -1) list.push({ chatId, messages: [message] });
  else list[i].messages.push(message);
  write(K.CHATS, list);
};
