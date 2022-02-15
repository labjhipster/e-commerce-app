import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import {
  ShipmentComponentsPage,
  /* ShipmentDeleteDialog, */
  ShipmentUpdatePage,
} from './shipment.page-object';

const expect = chai.expect;

describe('Shipment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let shipmentComponentsPage: ShipmentComponentsPage;
  let shipmentUpdatePage: ShipmentUpdatePage;
  /* let shipmentDeleteDialog: ShipmentDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Shipments', async () => {
    await navBarPage.goToEntity('shipment');
    shipmentComponentsPage = new ShipmentComponentsPage();
    await browser.wait(ec.visibilityOf(shipmentComponentsPage.title), 5000);
    expect(await shipmentComponentsPage.getTitle()).to.eq('storeApp.invoiceShipment.home.title');
    await browser.wait(ec.or(ec.visibilityOf(shipmentComponentsPage.entities), ec.visibilityOf(shipmentComponentsPage.noResult)), 1000);
  });

  it('should load create Shipment page', async () => {
    await shipmentComponentsPage.clickOnCreateButton();
    shipmentUpdatePage = new ShipmentUpdatePage();
    expect(await shipmentUpdatePage.getPageTitle()).to.eq('storeApp.invoiceShipment.home.createOrEditLabel');
    await shipmentUpdatePage.cancel();
  });

  /* it('should create and save Shipments', async () => {
        const nbButtonsBeforeCreate = await shipmentComponentsPage.countDeleteButtons();

        await shipmentComponentsPage.clickOnCreateButton();

        await promise.all([
            shipmentUpdatePage.setTrackingCodeInput('trackingCode'),
            shipmentUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            shipmentUpdatePage.setDetailsInput('details'),
            shipmentUpdatePage.invoiceSelectLastOption(),
        ]);

        await shipmentUpdatePage.save();
        expect(await shipmentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await shipmentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Shipment', async () => {
        const nbButtonsBeforeDelete = await shipmentComponentsPage.countDeleteButtons();
        await shipmentComponentsPage.clickOnLastDeleteButton();

        shipmentDeleteDialog = new ShipmentDeleteDialog();
        expect(await shipmentDeleteDialog.getDialogTitle())
            .to.eq('storeApp.invoiceShipment.delete.question');
        await shipmentDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(shipmentComponentsPage.title), 5000);

        expect(await shipmentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
