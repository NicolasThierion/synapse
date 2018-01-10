import { Address } from './address.model';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: Address;
  phone: string;

  constructor(id: number,
              firstName: string,
              lastName: string,
              username: string,
              email?: string,
              address?: Address,
              phone?: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.address = address;
    this.phone = phone;
  }

  static of(user: {[key in keyof User]?: any}): User {
    const u = user as User;
    const mandatoryAttributes = ['id', 'firstName', 'lastName', 'username'];

    for (const attr of mandatoryAttributes) {
      if (typeof user[attr] === 'undefined') {
        throw new TypeError(`should have an attribute ${attr}`);
      }
    }

    return new User(
      u.id,
      u.firstName,
      u.lastName,
      u.username,
      u.email,
      u.address,
      u.phone
    );
  }
}
