import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillService } from 'src/app/bill.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillPage implements OnInit {

  calendarLoading: boolean = true;
  loadError: boolean = false;
  changeLoading: boolean = false;
  sendRequest: boolean = false;
  toastColor: string = 'primary';
  toastMessage: string = '';
  isToastOpen: boolean = false;
  expiredBills: number = 0

  bills: any;
  selectedBill: any = {
    bill_type: {
      name: ''
    },
    description: '',
    value: 0.0,
    day: 0,
    month: 0,
    year: 0,
    paid: false
  }
  newBill: any = {
    bill_type: {
      name: ''
    },
    description: '',
    value: 0.0,
    day: 0,
    month: 0,
    year: 0,
    last_pay: new Date(),
    paid: false,
    recurrency: ''
  }
  newBillDate: string = new Date().toISOString();
  newBillLastPay: string = new Date().toISOString();
  selectedBillDate: string = new Date().toISOString();
  billTypes: any;

  date = new Date();
  month = this.date.getMonth();
  year = this.date.getFullYear();

  today = new Date();
  badgeGuide = new Date();

  maxDate = new Date(this.today.getFullYear()+5, 11, 31).toISOString();

  months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  recurrencys = [
    'Único',
    'Semanal',
    'Mensal',
    'Bimestral',
    'Trimestral',
    'Semestral',
    'Anual'
  ]

  constructor(private bill: BillService, private actSheetCtrl:ActionSheetController) { }

  ngOnInit() {
    this.bill.getBills(this.month + 1, this.year).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.calendarLoading = false;
        this.bills = response.body;
        this.bills.sort((a: any, b: any) => a.day - b.day);
      }
    }, (error) => {
      this.loadError = true;
      this.calendarLoading = false;
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao buscar as despesas!';
      this.isToastOpen = true;
    })
    this.bill.getBillTypes().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.billTypes = response.body
      }
    }, (error) => {
      this.loadError = true;
      this.calendarLoading = false;
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao buscar os tipos de despesas!';
      this.isToastOpen = true;
    })
    this.expiredBills = this.bill.expiredBills;
  }

  previousMonth() {
    this.changeLoading = true;
    if (this.month > 0) {
      this.month--;
    } else if (this.month == 0) {
      this.month = 11;
      this.year--;
    }

    this.getBills();
  }

  nextMonth() {
    this.changeLoading = true;
    if (this.month < 11) {
      this.month++;
    } else if (this.month == 11) {
      this.month = 0;
      this.year++;
    }

    this.getBills();
  }

  async getBills() {
    this.bill.getBills(this.month + 1, this.year).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.calendarLoading = false;
        this.changeLoading = false;
        this.bills = response.body;
        this.bills.sort((a: any, b: any) => a.day - b.day);
      } else {
        this.loadError = true;
        this.calendarLoading = false;
        this.changeLoading = false;
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao buscar as despesas!';
        this.isToastOpen = true;
      }
    })
  }

  getBillDate(bill: any) {
    return new Date(bill.year, bill.month - 1, bill.day)
  }

  getColorBill(bill: any) {
    if (new Date(bill.year, bill.month - 1, bill.day) < this.today && !bill.paid) {
      return 'danger'
    } else if (new Date(bill.year, bill.month - 1, bill.day) == this.today) {
      return 'warning'
    } else {
      return ''
    }
  }

  openAddModal(modal:any){
    this.newBill = {
      bill_type: {
        name: ''
      },
      description: '',
      value: 0.0,
      day: 0,
      month: 0,
      year: 0,
      last_pay: new Date(),
      paid: false
    }
    this.newBillDate = new Date().toISOString();
    modal.present();
  }

  setNewBillDate(event: any) {
    this.newBillDate = event.detail.value;
    this.newBill.year = new Date(this.newBillDate).getFullYear();
    this.newBill.month = new Date(this.newBillDate).getMonth() + 1;
    this.newBill.day = new Date(this.newBillDate).getDate();
  }

  setNewBillLastPay(event: any) {
    this.newBillLastPay = event.detail.value;
    this.newBill.last_pay = new Date(this.newBillLastPay);
  }

  openBill(bill: any, modal: any) {
    this.selectedBill = bill;
    this.selectedBillDate = new Date(bill.year, bill.month - 1, bill.day).toISOString();
    modal.present();
  }

  setSelectedBillDate(event: any) {
    this.selectedBillDate = event.detail.value;
  }

  saveBill(modal: any) {
    this.sendRequest = true;
    let billDate = new Date(this.selectedBillDate);
    this.selectedBill.year = billDate.getFullYear();
    this.selectedBill.month = billDate.getMonth() + 1;
    this.selectedBill.day = billDate.getDate();
    this.bill.updateBill(this.selectedBill).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.toastColor = 'success';
        this.toastMessage = 'Despesa atualizada com sucesso!';
        this.isToastOpen = true;
        this.sendRequest = false;
        this.getBills();
        modal.dismiss();
      }
    }, (error) => {
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao atualizar a despesa!';
      this.isToastOpen = true;
      this.sendRequest = false;
    })
  }

  saveNewBill(modal: any) {
    this.sendRequest = true;
    this.newBill.year = new Date(this.newBillDate).getFullYear();
    this.newBill.month = new Date(this.newBillDate).getMonth() + 1;
    this.newBill.day = new Date(this.newBillDate).getDate();
    this.bill.createBill(this.newBill).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.toastColor = 'success';
        this.toastMessage = 'Despesa criada com sucesso!';
        this.isToastOpen = true;
        this.sendRequest = false;
        this.getBills();
        modal.dismiss();
      }
    }, (error) => {
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao criar a despesa!';
      this.isToastOpen = true;
      this.sendRequest = false;
    })
  }

  async refreshBills(event: any) {
    await this.getBills();
    if (event) event.target.complete();
  }

  formatInputValue(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    value = (parseInt(value) / 100).toFixed(2);

    this.selectedBill.value = value;
    event.target.value = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
  }

  formatPriceUpdate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    this.newBill.value = value;
    event.target.value = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
  }

  handleChangeBillType(event: any) {
    this.selectedBill.bill_type = this.billTypes.find((billType: any) => billType.id == event.target.value);
  }

  handleChangeNewBillType(event: any) {
    this.newBill.bill_type = this.billTypes.find((billType: any) => billType.id == event.target.value);
  }

  setNewBillRecurrency(event: any) {
    this.newBill.recurrency = event.detail.value;
  }

  async deleteBill(modal:any){
    this.sendRequest = true;

    let deleteConfirmation: () => Promise<boolean> = async (): Promise<boolean> => {
      const sheet = await this.actSheetCtrl.create({
        header: 'Tem certeza?',
        subHeader: 'Esta operação não pode ser desfeita',
        buttons: [
          {
            text: 'Excluir',
            role: 'destructive',
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      });

      sheet.present();

      const { role } = await sheet.onDidDismiss();
      return role === 'destructive';

    }

    if(await deleteConfirmation()) {
      this.bill.deleteBill(this.selectedBill.id).subscribe((response: HttpResponse<any>) => {
        if (response.ok) {
          this.toastColor = 'primary';
          this.toastMessage = 'Despesa deletada com sucesso!';
          this.isToastOpen = true;
          this.sendRequest = false;
          this.getBills();
          modal.dismiss();
        }
      }, (error) => {
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao deletar a despesa!';
        this.isToastOpen = true;
        this.sendRequest = false;
      })
    }else{
      this.sendRequest = false;
    }
  }

}
