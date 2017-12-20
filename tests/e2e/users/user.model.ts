import { Address } from './address.model';

export class User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;

  constructor(id: number,
              name: string,
              username: string,
              email?: string,
              address?: Address,
              phone?: string) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.address = address;
    this.phone = phone;
  }

  static of(user: any): User {
    const u = user as User;
    const mandatoryAttributes = ['id', 'name', 'username'];

    for (const attr of mandatoryAttributes) {
      if (typeof user[attr] === 'undefined') {
        throw new TypeError(`should have an attribute ${attr}`);
      }
    }

    return new User(
      u.id,
      u.name,
      u.username,
      u.email,
      u.address,
      u.phone
    );
  }

  static serialize(user: User): any {
    return user;
  }

  static deserialize(user: any): User {
    const u = user as User;
    if (u.address) {
      u.address = Address.deserialize(u.address);
    }

    return User.of(u);
  }
}
