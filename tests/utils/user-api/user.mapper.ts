import { Address } from './models/address.model';
import { User } from './models/user.model';

export class UserMapper {
  fromJson(json: any): User {
    return User.of({
      id: json.id,
      firstName: (json.name || ``).split(' ')[0],
      lastName: (json.name || ``).split(' ')[1],
      username: json.username,
      email: json.email,
      address: json.street ? Address.of({
        street: json.street,
        suite: json.suite,
        city: json.city,
        zipcode: json.zipcode
      }) : undefined,
      phone: json.phone
    });
  }

  toJson(obj: User): Object {
    if (!obj) {
      throw new TypeError('User is null');
    }
    const MANDATORY_ATTRIBUTES = ['firstName', 'lastName', 'email'];
    for (const attr of MANDATORY_ATTRIBUTES) {
      if (typeof obj[attr] === 'undefined') {
        throw new TypeError(`Malformed User: should have an attribute ${attr}`);
      }
    }

    const json = {
      id: obj.id,
      name: `${obj.firstName} ${obj.lastName}`,
      username: obj.username,
      email: obj.email
    };

    if (obj.address) {
      Object.assign(json, {
        street: obj.address.street,
        suite: obj.address.suite,
        city: obj.address.city,
        zipcode: obj.address.zipcode
      });
    }

    return json;
  }
}
