import { async, inject, TestBed } from '@angular/core/testing';
import { RestApi } from './rest-api.decorator';
import { TestingModule } from '../../angular/utils/testing.module';

fdescribe('@RestApi annotation', () => {

  it('should exists', () => {
    expect(RestApi).toBeDefined();
    expect(RestApi).toEqual(jasmine.any(Function));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
    });
  }));
});
