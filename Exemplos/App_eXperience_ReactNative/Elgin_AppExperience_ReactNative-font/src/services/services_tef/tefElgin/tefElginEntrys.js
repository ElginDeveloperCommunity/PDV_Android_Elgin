export default class SitefEntrys {
  constructor() {
    this.value = '1000';
    this.numberInstallments = 1;
    this.paymentMethod = 'Crédito';
    this.installmentsMethod = 'Loja';
    this.lastElginTefNSU = '';
  }

  getValue() {
    return this.value;
  }

  getNumberInstallments() {
    return this.numberInstallments;
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

  getInstallmentsMethod() {
    return this.installmentsMethod;
  }

  getLastElginTefNSU() {
    return this.lastElginTefNSU;
  }

  setValue(value) {
    this.value = value;
  }

  setNumberInstallments(numberInstallments) {
    this.numberInstallments = numberInstallments;
  }

  setPaymentMethod(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  setInstallmentsMethod(installmentsMethod) {
    this.installmentsMethod = installmentsMethod;
  }

  setLastElginTefNSU(lastElginTefNSU) {
    this.lastElginTefNSU = lastElginTefNSU;
  }
}
