import sendCodeToVerifyEmail from '../../utils/sendCodeToVerifyEmail';

describe('sendCodeToVerifyEmail()', () => {
  it('should return success result', async () => {
    const result = await sendCodeToVerifyEmail('ahmetbcakici@gmail.com', 2222);
    expect(result).toEqual('sccs');
  });
});
