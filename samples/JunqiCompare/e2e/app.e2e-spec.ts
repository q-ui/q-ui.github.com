import { MyNg2DemoPage } from './app.po';

describe('my-ng2-demo App', () => {
  let page: MyNg2DemoPage;

  beforeEach(() => {
    page = new MyNg2DemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
