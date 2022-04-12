import 'dart:core';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_smartpos/Widgets/widgets.dart';
import 'package:flutter_smartpos/services/service_elginpay.dart';
import 'package:flutter_smartpos/services/service_printer.dart';
import 'package:currency_text_input_formatter/currency_text_input_formatter.dart';
import 'package:intl/intl.dart';

class ElginPayPage extends StatefulWidget {
  @override
  _ElginPayPageState createState() => _ElginPayPageState();
}

class _ElginPayPageState extends State<ElginPayPage> {
  final CurrencyTextInputFormatter _formatter = new CurrencyTextInputFormatter(
      decimalDigits: 2, locale: 'pt_BR', symbol: '', turnOffGrouping: true);

  TextEditingController inputValue = new TextEditingController(text: "20,00");
  TextEditingController inputNumberOfInstallments =
      new TextEditingController(text: "1");

  ElginpayService elginpayService = new ElginpayService();

  String selectedPaymentMethod = "Crédito";
  String selectedInstallmentsMethod = "Avista";

  String boxText = '';
  String retornoUltimaVenda = '';

  bool customLayout = false;

  PrinterService printerService = new PrinterService();

  @override
  void initState() {
    super.initState();
    printerService.connectInternalImp().then((value) => print(value));
  }

  onChangePaymentMethod(String value) {
    setState(() => selectedPaymentMethod = value);
  }

  onChangeInstallmentsMethod(String value) {
    setState(() => selectedInstallmentsMethod = value);
  }

  onCustomLayoutTapped(bool newValue) async {
    setState(() {
      customLayout = newValue;
    });

    final String result;
    if (customLayout)
      result = await elginpayService.setCustomLayoutOn();
    else
      result = await elginpayService.setCustomLayoutOff();
    print(result);
  }

  Future<void> _showMyDialog(String dialogTitle, String dialogText) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(dialogTitle),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[Text(dialogText)],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  //Handler para capturar retorno do ElginPay
  Future<void> _methodCallHandler(MethodCall call) async {
    switch (call.method) {
      case "elginpayConcluido":
        setState(() {
          this.retornoUltimaVenda = call.arguments['saida'];
        });
        _showMyDialog('Retorno ElginPay', this.retornoUltimaVenda);

        break;
      default:
        throw MissingPluginException();
    }
  }

  //O valor mínimo para uma transação no ElginPay é de 1.00 real, portanto devemos fazer esta checagem antes de enviarmos o valor para qualquer função de pagamento
  bool isValueValidToElginPay() {
    if (inputValue.text.toString() == '') {
      return false;
    }

    double value =
        double.parse(inputValue.text.toString().replaceAll(',', '.'));

    if (value < 1.00) return false;
    return true;
  }

  sendElginPayParams(String function) async {
    if (function == "CONFIG")
      elginpayService.iniciaOperacaoAdministrativa();
    else if (!isValueValidToElginPay())
      _showMyDialog('Alerta',
          'O valor mínimo para uma transação por Elgin Pay é de 1,00 real!');
    else {
      //O formato do valor aceito pelo ElginPay é em uma String contendo o valor centavos
      String valueTreated = inputValue.text.toString().replaceAll(',', '');
      if (function == "SALE") {
        if (selectedPaymentMethod == "Débito") {
          elginpayService
              .iniciaVendaDebito(value: valueTreated)
              .then((value) => elginpayService.setHandler(_methodCallHandler));
        } else {
          if (this.inputNumberOfInstallments.text.toString() == '' ||
              int.parse(this.inputNumberOfInstallments.text.toString()) == 0)
            _showMyDialog('Alerta',
                'Insira um número válido de parcelas para continuar com uma transação com cartão de crédito!');
          else {
            elginpayService
                .iniciaVendaCredito(
                    value: inputValue.text,
                    installmentMethod: this.selectedInstallmentsMethod,
                    numberOfInstallments: int.parse(
                        this.inputNumberOfInstallments.text.toString()))
                .then(
                    (value) => elginpayService.setHandler(_methodCallHandler));
          }
        }
      } else if (function == "CANCEL") {
        //No app APP Experience, para fins de simplificação, faremos cancelamento apenas de vendas do mesmo dia, mas como pode ser inspecionado abaixo e na função no methodChannel no Java, podemos passar a data de cancelamento diretamente pra função de cancelamento
        DateTime now = DateTime.now();
        String formattedDate = DateFormat('dd/MM/yy').format(now);

        final ButtonStyle cancelButtonStyle =
            TextButton.styleFrom(primary: Colors.red);

        final ButtonStyle okButtonStyle =
            TextButton.styleFrom(primary: Colors.green);

        String inputRef = '';

        return showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) {
              return AlertDialog(
                title: Text('Código de Referência: '),
                content: TextField(
                  autofocus: true,
                  onChanged: (value) {
                    setState(() {
                      inputRef = value;
                    });
                  },
                  //teclado numérico:
                  keyboardType: TextInputType.number,
                  //aceitar apenas caractéres numéricos de 0 a 9
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp('[0-9]')),
                  ],
                ),
                actions: <Widget>[
                  TextButton(
                    style: cancelButtonStyle,
                    child: Text('CANCEL'),
                    onPressed: () {
                      setState(() {
                        Navigator.pop(context);
                      });
                    },
                  ),
                  TextButton(
                    style: okButtonStyle,
                    child: Text('OK'),
                    onPressed: () {
                      setState(() {
                        //a opção ok só deve ser aceita quando houver algum valor no input
                        if (inputRef != '') {
                          elginpayService.iniciaCancelamentoVenda(
                              value: valueTreated,
                              saleRef: inputRef,
                              date: formattedDate);
                          Navigator.pop(context);
                        }
                      });
                    },
                  ),
                ],
              );
            });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
      child: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            GeneralWidgets.headerScreen("ELGIN PAY"),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: fieldsMsitef(),
            ),
            GeneralWidgets.baseboard(),
          ],
        ),
      ),
    ));
  }

  Widget fieldsMsitef() {
    return Container(
      height: 410,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          GeneralWidgets.inputFieldWithFormatter(
              inputValue, 'VALOR:  ', _formatter,
              textSize: 14, iWidht: 350, textInputType: TextInputType.number),
          if (selectedPaymentMethod == "Crédito") ...{
            GeneralWidgets.inputFieldWithFormatter(
              inputNumberOfInstallments,
              'NÚM DE PARCELAS:  ',
              FilteringTextInputFormatter.allow(RegExp('[0-9]')),
              textSize: 14,
              iWidht: 350,
              textInputType: TextInputType.number,
            )
          },
          Container(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("FORMAS DE PAGAMENTO:",
                    style:
                        TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                SizedBox(
                  height: 10,
                ),
                paymentsMethodsWidget(selectedPaymentMethod),
              ],
            ),
          ),
          Container(
              child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("TIPO DE PARCELAMENTO:",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              SizedBox(
                height: 10,
              ),
              installmentsMethodsWidget(selectedInstallmentsMethod),
            ],
          )),
          Container(
            child: Column(
              children: [
                Divider(),
                GeneralWidgets.checkBox("LAYOUT PERSONALIZADO", customLayout,
                    (bool value) {
                  onCustomLayoutTapped(value);
                }),
                Divider(),
                Row(
                  children: [
                    GeneralWidgets.personButton(
                        textButton: "ENVIAR TRANSAÇÃO",
                        callback: () => sendElginPayParams("SALE"),
                        width: 160,
                        fontSize: 10),
                    SizedBox(width: 20),
                    GeneralWidgets.personButton(
                        textButton: "CANCELAR TRANSAÇÃO",
                        callback: () => sendElginPayParams("CANCEL"),
                        width: 160,
                        fontSize: 10),
                  ],
                ),
                SizedBox(height: 10),
                GeneralWidgets.personButton(
                    textButton: "CONFIGURAÇÃO",
                    callback: () => sendElginPayParams("CONFIG"),
                    width: MediaQuery.of(context).size.width,
                    fontSize: 10),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget paymentsMethodsWidget(String selectedPaymentMethod) {
    return Row(
      children: [
        GeneralWidgets.personSelectedButton(
          nameButton: 'Crédito',
          fontLabelSize: 12,
          assetImage: 'assets/images/card.png',
          isSelectedBtn: selectedPaymentMethod == 'Crédito',
          onSelected: () => onChangePaymentMethod('Crédito'),
        ),
        GeneralWidgets.personSelectedButton(
          nameButton: 'Débito',
          fontLabelSize: 12,
          assetImage: 'assets/images/card.png',
          isSelectedBtn: selectedPaymentMethod == 'Débito',
          onSelected: () => onChangePaymentMethod('Débito'),
        ),
      ],
    );
  }

  Widget installmentsMethodsWidget(String selectedInstall) {
    return Row(
      children: [
        if (selectedPaymentMethod == "Crédito") ...{
          GeneralWidgets.personSelectedButton(
            nameButton: 'Loja',
            fontLabelSize: 12,
            isSelectedBtn: selectedInstall == 'Loja',
            assetImage: 'assets/images/store.png',
            onSelected: () => onChangeInstallmentsMethod('Loja'),
          ),
          GeneralWidgets.personSelectedButton(
            nameButton: 'Adm',
            fontLabelSize: 12,
            isSelectedBtn: selectedInstall == 'Adm',
            assetImage: 'assets/images/adm.png',
            onSelected: () => onChangeInstallmentsMethod('Adm'),
          ),
          GeneralWidgets.personSelectedButton(
            nameButton: 'A vista',
            fontLabelSize: 12,
            isSelectedBtn: selectedInstall == 'Avista',
            assetImage: 'assets/images/card.png',
            onSelected: () => onChangeInstallmentsMethod('Avista'),
          ),
        }
      ],
    );
  }
}
