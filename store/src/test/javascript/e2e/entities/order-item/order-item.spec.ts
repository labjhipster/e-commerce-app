import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  OrderItemComponentsPage,
  /* OrderItemDeleteDialog, */
  OrderItemUpdatePage,
} from './order-item.page-object';

const expect = chai.expect;

describe('OrderItem e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let orderItemComponentsPage: OrderItemComponentsPage;
  let orderItemUpdatePage: OrderItemUpdatePage;
  /* let orderItemDeleteDialog: OrderItemDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load OrderItems', async () => {
    await navBarPage.goToEntity('order-item');
    orderItemComponentsPage = new OrderItemComponentsPage();
    await browser.wait(ec.visibilityOf(orderItemComponentsPage.title), 5000);
    expect(await orderItemComponentsPage.getTitle()).to.eq('storeApp.orderItem.home.title');
    await browser.wait(ec.or(ec.visibilityOf(orderItemComponentsPage.entities), ec.visibilityOf(orderItemComponentsPage.noResult)), 1000);
  });

  it('should load create OrderItem page', async () => {
    await orderItemComponentsPage.clickOnCreateButton();
    orderItemUpdatePage = new OrderItemUpdatePage();
    expect(await orderItemUpdatePage.getPageTitle()).to.eq('storeApp.orderItem.home.createOrEditLabel');
    await orderItemUpdatePage.cancel();
  });

  /* it('should create and save OrderItems', async () => {
        const nbButtonsBeforeCreate = await orderItemComponentsPage.countDeleteButtons();

        await orderItemComponentsPage.clickOnCreateButton();

        await promise.all([
            orderItemUpdatePage.setQuantityInput('5'),
            orderItemUpdatePage.setTotalPriceInput('5'),
            orderItemUpdatePage.statusSelectLastOption(),
            orderItemUpdatePage.productSelectLastOption(),
            orderItemUpdatePage.orderSelectLastOption(),
        ]);

        await orderItemUpdatePage.save();
        expect(await orderItemUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await orderItemComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last OrderItem', async () => {
        const nbButtonsBeforeDelete = await orderItemComponentsPage.countDeleteButtons();
        await orderItemComponentsPage.clickOnLastDeleteButton();

        orderItemDeleteDialog = new OrderItemDeleteDialog();
        expect(await orderItemDeleteDialog.getDialogTitle())
            .to.eq('storeApp.orderItem.delete.question');
        await orderItemDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(orderItemComponentsPage.title), 5000);

        expect(await orderItemComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
