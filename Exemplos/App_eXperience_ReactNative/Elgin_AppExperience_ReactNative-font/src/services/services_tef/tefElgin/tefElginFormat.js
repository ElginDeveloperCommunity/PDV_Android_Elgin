import moment from 'moment';

export default class TefElginFormat {
  formatTefElginEntrysToJson(tefElginFunction, tefElginEntries) {
    let mapTefElgin = new Map();

    mapTefElgin.valor = tefElginEntries.getValue().toString();

    if (tefElginFunction === 'SALE') {
      mapTefElgin.modalidade = this.paymentToYourCode(
        tefElginEntries.getPaymentMethod(),
      );

      if (tefElginEntries.getPaymentMethod() === 'Crédito') {
        if (
          tefElginEntries.getNumberInstallments() === 1 ||
          tefElginEntries.getNumberInstallments() === 0
        ) {
          mapTefElgin.transacoesHabilitadas = '26';
        } else if (tefElginEntries.getInstallmentsMethod() === 'Loja') {
          mapTefElgin.transacoesHabilitadas = '27';
        } else if (tefElginEntries.getInstallmentsMethod() === 'Adm') {
          mapTefElgin.transacoesHabilitadas = '28';
        }

        mapTefElgin.numParcelas = tefElginEntries
          .getNumberInstallments()
          .toString();
      }
      if (tefElginEntries.getPaymentMethod() === 'Débito') {
        mapTefElgin.transacoesHabilitadas = '16';
        mapTefElgin.numParcelas = '';
      }
    }

    if (tefElginFunction === 'CANCEL') {
      mapTefElgin.modalidade = '200';
      mapTefElgin.data = moment().utcOffset('-04:00').format('YYYYMMDD');
      mapTefElgin.NSU_SITEF = tefElginEntries.getLastElginTefNSU();
    }
    return mapTefElgin;
  }

  paymentToYourCode(payment) {
    switch (payment) {
      case 'Crédito':
        return '3';
      case 'Débito':
        return '2';
      default:
        return '0';
    }
  }
}
