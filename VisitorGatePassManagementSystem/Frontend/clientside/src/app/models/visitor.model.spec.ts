import { Visitor } from './visitor.model';

describe('Visitor', () => {
  it('should allow a valid object that matches the Visitor interface', () => {
    const visitor = {} as Visitor;
    expect(visitor).toBeDefined();
  });
});
