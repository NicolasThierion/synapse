import { User } from './models/user.model';
import { Address } from './models/address.model';

export class UserMapper {
  fromJson(json: any): User {
    return User.of({
      id: json.id,
      firstName: json.name.split(' ')[0],
      lastName: json.name.split(' ')[1],
      username: json.username,
      email: json.email,
      address: Address.of({
        street: json.address.street,
        suite: json.address.suite,
        city: json.address.city,
        zipcode: json.address.zipcode
      }),
      phone: json.phone
    });
  }

  toJson(obj: User): Object {
    return {
      id: obj.id,
      name: `${obj.firstName} ${obj.lastName}`,
      username: obj.username,
      email: obj.email,
      street: obj.address.street,
      suite: obj.address.suite,
      city: obj.address.city,
      zipcode: obj.address.zipcode
    };
  }
}
