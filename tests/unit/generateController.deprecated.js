import {generateController} from '../../controllers/event';

describe('generateController()', () => {
  it('should be equal', () => {
    const req = {
      body: {
        guests: ['Sinan Çaldır'],
        title: 'NextJS',
        subtitle: 'NextJS Nedir? SSR Nedir? Superset of ReactJS',
        description: 'Lorem ipsum dolor sit amet.',
        address: 'youtube.com',
        isOnline: true,
        organizer: 'İstanbul Bilişim Topluluğu',
        date: '2020-06-25T20:00:00.000Z',
      },
    };
    console.log(req.body.title);
    expect(generateController(req, res)).toBeDefined();
  });
});
