// import { SynapseApi } from './synapse-api.decorator';
// import { GET } from './synapse-endpoint.decorator';
// import { Address } from '../../../tests/e2e/users/address.model';
// import { Observable } from 'rxjs/Observable';
//
// @Cacheable()
// class User {
//
//   // @JsonName('email');
//   // mail: string;
//   //
//   // @Mapper(AddressMapper)
//   // address: Address;
//
//
// }
//
// interface Mapper <T, U> {
//   priority: number;
//   accept: (from: T) => boolean;
//   fn: (from: T) => U;
// }
//
// interface JsonMapperFactory<T> {
//   toJSON(from: T): Object;
//   fromJSON(from: Object): T;
// }
//
// class UserMapperFactory implements JsonMapperFactory<User> {
// }
//
//
// @SynapseApi()
// // @Mappers([UserMapper])
// @EnableCache()
// class UserApi {
//
//   @GET({
//     mapper: UserMapper
//     })
//   getAll(): Observable<User> {
//
//   }
//
// }
