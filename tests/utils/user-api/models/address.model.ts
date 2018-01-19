export class Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;

  constructor(street: string,
              city: string,
              zipcode: string,
              suite?: string) {
    this.street = street;
    this.suite = suite;
    this.city = city;
    this.zipcode = zipcode;
  }

  static of(address: any): Address {
    const a = address as Address;
    const mandatoryAttributes = [
      'street',
      'city',
      'zipcode'
    ];

    for (const attr of mandatoryAttributes) {
      if (typeof address[attr] === 'undefined') {
        throw new TypeError(`Malformed address: should have an attribute ${attr}`);
      }
    }

    return new Address(
      a.street,
      a.city,
      a.zipcode,
      a.suite);
  }

  static serialize(address: Address): any {
    return address;
  }

  static deserialize(address: any): Address {
    return Address.of(address);
  }
}
