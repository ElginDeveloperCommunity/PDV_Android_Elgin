export default class SitefEntrys {
  constructor() {
    this.value = '1000';
    this.numberInstallments = 1;
    this.ip = '192.168.0.15';
    this.paymentMethod = 'Crédito';
    this.installmentsMethod = 'Loja';
  }

  getValue() {
    return this.value;
  }

  getNumberInstallments() {
    return this.numberInstallments;
  }

  getIp() {
    return this.ip;
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

  getInstallmentsMethods() {
    return this.installmentsMethod;
  }

  setValue(value) {
    this.value = value;
  }

  setNumberInstallments(numberInstallments) {
    this.numberInstallments = numberInstallments;
  }

  setIp(ip) {
    this.ip = ip;
  }

  setPaymentMethod(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  setInstallmentsMethods(installmentsMethod) {
    this.installmentsMethod = installmentsMethod;
  }
}
