import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'storeApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'storeApp.productCategory.home.title' },
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'storeApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'product-order',
        data: { pageTitle: 'storeApp.productOrder.home.title' },
        loadChildren: () => import('./product-order/product-order.module').then(m => m.ProductOrderModule),
      },
      {
        path: 'order-item',
        data: { pageTitle: 'storeApp.orderItem.home.title' },
        loadChildren: () => import('./order-item/order-item.module').then(m => m.OrderItemModule),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'storeApp.invoiceInvoice.home.title' },
        loadChildren: () => import('./invoice/invoice/invoice.module').then(m => m.InvoiceInvoiceModule),
      },
      {
        path: 'shipment',
        data: { pageTitle: 'storeApp.invoiceShipment.home.title' },
        loadChildren: () => import('./invoice/shipment/shipment.module').then(m => m.InvoiceShipmentModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'storeApp.notificationNotification.home.title' },
        loadChildren: () => import('./notification/notification/notification.module').then(m => m.NotificationNotificationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
