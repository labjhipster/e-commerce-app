import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  CustomerComponentsPage,
  /* CustomerDeleteDialog, */
  CustomerUpdatePage,
} from './customer.page-object';

const expect = chai.expect;

describe('Customer e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let customerComponentsPage: CustomerComponentsPage;
  let customerUpdatePage: CustomerUpdatePage;
  /* let customerDeleteDialog: CustomerDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Customers', async () => {
    await navBarPage.goToEntity('customer');
    customerComponentsPage = new CustomerComponentsPage();
    await browser.wait(ec.visibilityOf(customerComponentsPage.title), 5000);
    expect(await customerComponentsPage.getTitle()).to.eq('storeApp.customer.home.title');
    await browser.wait(ec.or(ec.visibilityOf(customerComponentsPage.entities), ec.visibilityOf(customerComponentsPage.noResult)), 1000);
  });

  it('should load create Customer page', async () => {
    await customerComponentsPage.clickOnCreateButton();
    customerUpdatePage = new CustomerUpdatePage();
    expect(await customerUpdatePage.getPageTitle()).to.eq('storeApp.customer.home.createOrEditLabel');
    await customerUpdatePage.cancel();
  });

  /* it('should create and save Customers', async () => {
        const nbButtonsBeforeCreate = await customerComponentsPage.countDeleteButtons();

        await customerComponentsPage.clickOnCreateButton();

        await promise.all([
            customerUpdatePage.setFirstNameInput('firstName'),
            customerUpdatePage.setLastNameInput('lastName'),
            customerUpdatePage.genderSelectLastOption(),
            customerUpdatePage.setEmailInput('J]&#34;,@2,lV-.+'),
            customerUpdatePage.setPhoneInput('phone'),
            customerUpdatePage.setAddressLine1Input('addressLine1'),
            customerUpdatePage.setAddressLine2Input('addressLine2'),
            customerUpdatePage.setCityInput('city'),
            customerUpdatePage.setCountryInput('country'),
            customerUpdatePage.userSelectLastOption(),
        ]);

        await customerUpdatePage.save();
        expect(await customerUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await customerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Customer', async () => {
        const nbButtonsBeforeDelete = await customerComponentsPage.countDeleteButtons();
        await customerComponentsPage.clickOnLastDeleteButton();

        customerDeleteDialog = new CustomerDeleteDialog();
        expect(await customerDeleteDialog.getDialogTitle())
            .to.eq('storeApp.customer.delete.question');
        await customerDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(customerComponentsPage.title), 5000);

        expect(await customerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
