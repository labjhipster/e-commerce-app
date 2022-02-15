import { element, by, ElementFinder } from 'protractor';

export class NotificationComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-notification div table .btn-danger'));
  title = element.all(by.css('jhi-notification div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class NotificationUpdatePage {
  pageTitle = element(by.id('jhi-notification-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  dateInput = element(by.id('field_date'));
  detailsInput = element(by.id('field_details'));
  sentDateInput = element(by.id('field_sentDate'));
  formatSelect = element(by.id('field_format'));
  userIdInput = element(by.id('field_userId'));
  productIdInput = element(by.id('field_productId'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async setDetailsInput(details: string): Promise<void> {
    await this.detailsInput.sendKeys(details);
  }

  async getDetailsInput(): Promise<string> {
    return await this.detailsInput.getAttribute('value');
  }

  async setSentDateInput(sentDate: string): Promise<void> {
    await this.sentDateInput.sendKeys(sentDate);
  }

  async getSentDateInput(): Promise<string> {
    return await this.sentDateInput.getAttribute('value');
  }

  async setFormatSelect(format: string): Promise<void> {
    await this.formatSelect.sendKeys(format);
  }

  async getFormatSelect(): Promise<string> {
    return await this.formatSelect.element(by.css('option:checked')).getText();
  }

  async formatSelectLastOption(): Promise<void> {
    await this.formatSelect.all(by.tagName('option')).last().click();
  }

  async setUserIdInput(userId: string): Promise<void> {
    await this.userIdInput.sendKeys(userId);
  }

  async getUserIdInput(): Promise<string> {
    return await this.userIdInput.getAttribute('value');
  }

  async setProductIdInput(productId: string): Promise<void> {
    await this.productIdInput.sendKeys(productId);
  }

  async getProductIdInput(): Promise<string> {
    return await this.productIdInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class NotificationDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-notification-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-notification'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
