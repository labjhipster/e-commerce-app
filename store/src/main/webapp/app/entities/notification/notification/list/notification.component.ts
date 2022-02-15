import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INotification } from '../notification.model';
import { NotificationService } from '../service/notification.service';
import { NotificationDeleteDialogComponent } from '../delete/notification-delete-dialog.component';

@Component({
  selector: 'jhi-notification',
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  notifications?: INotification[];
  isLoading = false;

  constructor(protected notificationService: NotificationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.notificationService.query().subscribe({
      next: (res: HttpResponse<INotification[]>) => {
        this.isLoading = false;
        this.notifications = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: INotification): number {
    return item.id!;
  }

  delete(notification: INotification): void {
    const modalRef = this.modalService.open(NotificationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.notification = notification;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
