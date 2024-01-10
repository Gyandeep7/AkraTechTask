// api.ts
import Dexie from 'dexie';

interface UserData {
  id: number;
  name: { first: string; last: string };
  picture: { thumbnail: string };
}

class UserDatabase extends Dexie {
  users: Dexie.Table<UserData, number>;

  constructor() {
    super('UserDatabase');
    this.version(1).stores({
      users: 'id',
    });
    this.users = this.table('users');
  }
}

const db = new UserDatabase();

export const saveUserData = async (data: UserData[]) => {
  await db.transaction('rw', db.users, async () => {
    await db.users.bulkPut(data);
  });
};

export const getAllUserData = async () => {
  return await db.users.toArray();
};

export const deleteUserData = async (id: number) => {
  await db.users.delete(id);
};

export const fetchRandomUserData = async () => {
  const response = await fetch('https://randomuser.me/api/?results=50');
  const data = await response.json();
  return data.results.map((user: any, index: number) => ({
    id: index + 1,
    name: {
      first: user.name.first,
      last: user.name.last,
    },
    picture: {
      thumbnail: user.picture.thumbnail,
    },
  }));
};
