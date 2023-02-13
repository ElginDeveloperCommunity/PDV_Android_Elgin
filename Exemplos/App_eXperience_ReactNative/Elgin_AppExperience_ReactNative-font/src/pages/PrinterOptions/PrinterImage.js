import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import {launchImageLibrary} from 'react-native-image-picker';
import Logo from '../../icons/ElginDeveloperCommunity.png';

import PrinterService from '../../services/service_printer';

const PrinterImage = () => {
  var printerService = new PrinterService();

  // Variáveis de Entrada
  const [isCutPaperActive, setIsCutPaperActive] = useState(false);
  const [image, setImage] = useState('');
  const [pathImage, setPathImage] = useState('');

  //Abre o picker de imagem
  const chooseImage = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        alert('NÃO FOI ESCOLHIDO NENHUMA IMAGEM');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('CÂMERA NÃO DISPONÍVEL');
        return;
      } else if (response.errorCode == 'permission') {
        alert('PERMISSÃO NÃO CONCEDIDA');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setImage(response);
      setPathImage(response.uri);
    });
  };

  function doPrinterImage() {
    //REALIZA A LIMPEZA DO URI PADRÃO REMOVENDO A PARTE INICIAL
    var newPathImage = pathImage.split('file://')[1];

    //SE NENHUMA IMAGEM FOI SELECIONADA NO DISPOSITIVO
    //ENVIA INFORMAÇÃO PARA IMPRIMIR IMAGEM PADRÃO DO APP - elgin.jpg
    if (pathImage === '') {
      printerService.sendPrinterImage('elgin', false);
    } else {
      printerService.sendPrinterImage(newPathImage, false);
    }

    printerService.jumpLine(10);
    if (isCutPaperActive) {
      printerService.cutPaper(10);
    }
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>IMPRESSÃO DE IMAGEM</Text>
        <Text style={styles.subTitleText}>PRÉ-VISUALIZAÇÃO</Text>
      </View>

      <View style={styles.uploadedImageView}>
        {image ? (
          <Image style={styles.imageZone} resizeMode="contain" source={image} />
        ) : (
          <Image style={styles.imageZone} resizeMode="contain" source={Logo} />
        )}
      </View>

      <View style={styles.imageStyleSettingsView}>
        <Text style={styles.labelText}>ESTILIZAÇÃO</Text>
        <View style={styles.imageStyleOptionsView}>
          <View style={styles.checkBoxStyleView}>
            <CheckBox
              disabled={false}
              value={isCutPaperActive}
              onValueChange={newValue => setIsCutPaperActive(newValue)}
            />
            <Text style={styles.optionText}>CUT PAPER</Text>
          </View>
        </View>
      </View>
      <View style={styles.submitButtonsView}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => chooseImage('photo')}>
          <Text style={styles.textButton}>SELECIONAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={doPrinterImage}>
          <Text style={styles.textButton}>IMPRIMIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subTitleText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainView: {
    width: '90%',
  },
  titleView: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedImageView: {
    alignItems: 'center',
    height: 150,
    justifyContent: 'center',
  },
  imageZone: {
    width: 150,
    height: 150,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#0069A5',
    backgroundColor: '#0069A5',
    height: 50,
    width: '46%',
    marginVertical: 5,
  },
  imageStyleSettingsView: {
    flexDirection: 'column',
  },
  imageStyleOptionsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageTypePicker: {
    width: 150,
    height: 50,
  },
  imageStylePicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxStyleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PrinterImage;
