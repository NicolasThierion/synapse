import { HttpBackendAdapter } from '../../core/http-backend.interface';
import { data } from './users.mock';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

class HttpResponnseOk extends Response {
  constructor(body?: any) {
    super(body, {
      status: 200, statusText: 'OK'
    });
  }
}

export class MockUserBackendAdapter implements HttpBackendAdapter {
  async get(request: Request): Promise<Response> {
    return Promise.resolve(new HttpResponnseOk(data));
  }

  async post(request: Request): Promise<Response> {
    const body = await request.json();
    try {
      _validateUser(body);
      return Promise.resolve(new HttpResponnseOk());
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async put(request: Request): Promise<Response> {
    const body = await request.json();
    try {
      _validateUser(body);
      return Promise.resolve(new HttpResponnseOk());
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async patch(request: Request): Promise<Response> {
    const body = await request.json();
    try {
      _validateUser(body);
      return Promise.resolve(new HttpResponnseOk());
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async delete(request: Request): Promise<Response> {
    const body = await request.json();
    try {
      _validateUser(body);
      return Promise.resolve(new HttpResponnseOk());
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

function _validateUser(user: any) {
  const mandatory = [
    'id',
    'name',
    'username',
    'email',
    'street',
    'suite',
    'city',
    'zipcode'
  ];
  const u = _.cloneDeep(user);
  mandatory.forEach(p => {
    if (!delete u[p]) {
      throw new Error(`missing property: ${p}`);
    }
  });

  if (Object.keys(u).length) {
    throw new Error(`invalid properties: ${Object.keys(u).join(', ')}`);
  }

  return user;
}
