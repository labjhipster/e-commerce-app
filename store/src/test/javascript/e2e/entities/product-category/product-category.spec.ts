import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductCategoryComponentsPage, ProductCategoryDeleteDialog, ProductCategoryUpdatePage } from './product-category.page-object';

const expect = chai.expect;

describe('ProductCategory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productCategoryComponentsPage: ProductCategoryComponentsPage;
  let productCategoryUpdatePage: ProductCategoryUpdatePage;
  let productCategoryDeleteDialog: ProductCategoryDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProductCategories', async () => {
    await navBarPage.goToEntity('product-category');
    productCategoryComponentsPage = new ProductCategoryComponentsPage();
    await browser.wait(ec.visibilityOf(productCategoryComponentsPage.title), 5000);
    expect(await productCategoryComponentsPage.getTitle()).to.eq('storeApp.productCategory.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(productCategoryComponentsPage.entities), ec.visibilityOf(productCategoryComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProductCategory page', async () => {
    await productCategoryComponentsPage.clickOnCreateButton();
    productCategoryUpdatePage = new ProductCategoryUpdatePage();
    expect(await productCategoryUpdatePage.getPageTitle()).to.eq('storeApp.productCategory.home.createOrEditLabel');
    await productCategoryUpdatePage.cancel();
  });

  it('should create and save ProductCategories', async () => {
    const nbButtonsBeforeCreate = await productCategoryComponentsPage.countDeleteButtons();

    await productCategoryComponentsPage.clickOnCreateButton();

    await promise.all([productCategoryUpdatePage.setNameInput('name'), productCategoryUpdatePage.setDescriptionInput('description')]);

    await productCategoryUpdatePage.save();
    expect(await productCategoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await productCategoryComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ProductCategory', async () => {
    const nbButtonsBeforeDelete = await productCategoryComponentsPage.countDeleteButtons();
    await productCategoryComponentsPage.clickOnLastDeleteButton();

    productCategoryDeleteDialog = new ProductCategoryDeleteDialog();
    expect(await productCategoryDeleteDialog.getDialogTitle()).to.eq('storeApp.productCategory.delete.question');
    await productCategoryDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(productCategoryComponentsPage.title), 5000);

    expect(await productCategoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
