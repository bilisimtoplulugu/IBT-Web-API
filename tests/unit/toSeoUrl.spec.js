import toSeoUrl from '../../utils/toSeoUrl';

describe('toSeoUrl()', () => {
  it('should be equal', () => {
    expect(toSeoUrl('Deno JS 101 Workshop'))
    .toEqual('deno-js-101-workshop');
  });
});
