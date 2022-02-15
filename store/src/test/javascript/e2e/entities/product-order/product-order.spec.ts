import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ProductOrderComponentsPage,
  /* ProductOrderDeleteDialog, */
  ProductOrderUpdatePage,
} from './product-order.page-object';

const expect = chai.expect;

describe('ProductOrder e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productOrderComponentsPage: ProductOrderComponentsPage;
  let productOrderUpdatePage: ProductOrderUpdatePage;
  /* let productOrderDeleteDialog: ProductOrderDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProductOrders', async () => {
    await navBarPage.goToEntity('product-order');
    productOrderComponentsPage = new ProductOrderComponentsPage();
    await browser.wait(ec.visibilityOf(productOrderComponentsPage.title), 5000);
    expect(await productOrderComponentsPage.getTitle()).to.eq('storeApp.productOrder.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(productOrderComponentsPage.entities), ec.visibilityOf(productOrderComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProductOrder page', async () => {
    await productOrderComponentsPage.clickOnCreateButton();
    productOrderUpdatePage = new ProductOrderUpdatePage();
    expect(await productOrderUpdatePage.getPageTitle()).to.eq('storeApp.productOrder.home.createOrEditLabel');
    await productOrderUpdatePage.cancel();
  });

  /* it('should create and save ProductOrders', async () => {
        const nbButtonsBeforeCreate = await productOrderComponentsPage.countDeleteButtons();

        await productOrderComponentsPage.clickOnCreateButton();

        await promise.all([
            productOrderUpdatePage.setPlacedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            productOrderUpdatePage.statusSelectLastOption(),
            productOrderUpdatePage.setCodeInput('code'),
            productOrderUpdatePage.customerSelectLastOption(),
        ]);

        await productOrderUpdatePage.save();
        expect(await productOrderUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await productOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last ProductOrder', async () => {
        const nbButtonsBeforeDelete = await productOrderComponentsPage.countDeleteButtons();
        await productOrderComponentsPage.clickOnLastDeleteButton();

        productOrderDeleteDialog = new ProductOrderDeleteDialog();
        expect(await productOrderDeleteDialog.getDialogTitle())
            .to.eq('storeApp.productOrder.delete.question');
        await productOrderDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(productOrderComponentsPage.title), 5000);

        expect(await productOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
