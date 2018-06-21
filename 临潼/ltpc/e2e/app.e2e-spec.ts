import { PcWebPage } from './app.po';

describe('pc-web App', () => {
  let page: PcWebPage;

  beforeEach(() => {
    page = new PcWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
