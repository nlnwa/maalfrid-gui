import { StatsPage } from './app.po';

describe('stats App', () => {
  let page: StatsPage;

  beforeEach(() => {
    page = new StatsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
