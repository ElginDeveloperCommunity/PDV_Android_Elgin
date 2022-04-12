import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GeneralWidgets extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }

  static Widget headerScreen(String textHeader) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            textHeader,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          Image.asset(
            "assets/images/elgin_logo.png",
            width: 120,
          ),
        ],
      ),
    );
  }

  static Widget baseboard() {
    return Align(
      alignment: Alignment.bottomRight,
      child: Padding(
        padding: const EdgeInsets.only(right: 40),
        child: Text(
          "Flutter - 1.1.0",
          style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  static Widget inputField(
    TextEditingController textFormField,
    String label , 
    {
    double textSize = 15,
    double iWidht = 250,
    TextInputType? textInputType,
    bool isEnable = true,
    
  }) {
    return SizedBox(
      width: iWidht,
      child: TextFormField(
        textAlign: TextAlign.center,
        enabled: isEnable,
        keyboardType: textInputType,
        decoration: InputDecoration(
          prefixIconConstraints: BoxConstraints(minWidth: 0, minHeight: 0),
          isDense: true,
          prefixIcon: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold),
          ),
        ),
        controller: textFormField,
        style: TextStyle(
          fontSize: textSize,
        ),
      ),
    );
  }

   static Widget inputFieldWithFormatter(
    TextEditingController textFormField,
    String label,
    TextInputFormatter textInputFormatter,
    {
    double textSize = 15,
    double iWidht = 250,
    TextInputType? textInputType,
    bool isEnable = true,
  }) {
    return SizedBox(
      width: iWidht,
      child: TextFormField(
        textAlign: TextAlign.center,
        enabled: isEnable,
        keyboardType: textInputType,
        inputFormatters: [textInputFormatter],
        decoration: InputDecoration(
          prefixIconConstraints: BoxConstraints(minWidth: 0, minHeight: 0),
          isDense: true,
          prefixIcon: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold),
          ),
        ),
        controller: textFormField,
        style: TextStyle(
          fontSize: textSize,
        ),
      ),
    );
  }

  static Widget personButton(
      {String textButton = "",
      double width = 170,
      double height = 40,
      VoidCallback? callback,
      double fontSize = 12}) {
    return Container(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: callback,
        child: Text(
          textButton,
          style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.bold),
        ),
        style: ElevatedButton.styleFrom(
          shape: new RoundedRectangleBorder(
            borderRadius: new BorderRadius.circular(10.0),
          ),
        ),
      ),
    );
  }

  static Widget radioBtn(
      String value, String groupSelected, Function onChanged) {
    return Container(
      height: 50,
      width: 180,
      child: ListTile(
        contentPadding: EdgeInsets.all(0),
        title: Text(
          value,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
        ),
        leading: Radio<String>(
          value: value,
          groupValue: groupSelected,
          onChanged: (String? value) => onChanged(value!),
        ),
      ),
    );
  }

  static Widget radioButton(
      String value, String groupSelected, Function onChanged) {
    return Container(
      width: 120,
      child: Container(
        child: Row(
          children: [
            Radio<String>(
              value: value,
              groupValue: groupSelected,
              onChanged: (String? value) => onChanged(value!),
            ),
            Text(value,
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  static Widget checkBox(String text, bool value, Function onChanged) {
    return Container(
        child: Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Checkbox(
          value: value,
          onChanged: (bool? value) => onChanged(value),
        ),
        Text(text, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    ));
  }

  static Widget dropDown(
      String text, List<String> elements, Function onChange) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        new DropdownButton<String>(
          items: elements.map((String value) {
            return new DropdownMenuItem<String>(
              value: value,
              child: new Text(value),
            );
          }).toList(),
          hint: Text(text, style: TextStyle(fontSize: 16)),
          onChanged: (String? value) => onChange(value),
        ),
      ],
    );
  }

  // Constroe o Button personalizado, que pode ou não ser selecionado
  static Widget personSelectedButton({
    String nameButton = "",
    String assetImage = "",
    @required VoidCallback? onSelected,
    double mHeight = 55,
    double iconSize = 25,
    double mWidth = 55,
    double fontLabelSize = 15,
    bool isSelectedBtn = false,
    Color colorGreen = Colors.green,
  }) {
    return TextButton(
      onPressed: onSelected,
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
      ),
      child: Container(
        margin: EdgeInsets.all(0),
        height: mHeight,
        width: mWidth,
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelectedBtn ? colorGreen : Colors.black,
            width: 3,
          ),
          borderRadius: BorderRadius.all(Radius.circular(15)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (assetImage != "") Image.asset(assetImage, height: iconSize),
            Text(
              nameButton,
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: fontLabelSize,
                  color: Colors.black,
                  fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  static Widget personSelectedButtonStatus({
    String nameButton = "",
    String assetImage = "",
    @required VoidCallback? onSelected,
    double mHeight = 55,
    double iconSize = 25,
    double mWidth = 55,
    double fontLabelSize = 10,
    bool isSelectedBtn = false,
    Color color = Colors.green,
  }) {
    return TextButton(
      onPressed: onSelected,
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
      ),
      child: Container(
        height: mHeight,
        width: mWidth,
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelectedBtn ? color : Colors.black,
            width: 3,
          ),
          borderRadius: BorderRadius.all(Radius.circular(15)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.info, color: Colors.blue),
            Text(
              nameButton,
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: fontLabelSize,
                  color: Colors.black,
                  fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  static Widget formFieldPerson(
    TextEditingController editingController, {
    String label = "",
    double width = 100,
    double height = 50,
    bool isEnable = true,
  }) {
    return Container(
      width: width,
      height: height,
      child: Center(
        child: TextFormField(
          textAlign: TextAlign.center,
          controller: editingController,
          keyboardType: TextInputType.text,
          enabled: isEnable,
          decoration: InputDecoration(
            prefixText: label,
            isDense: true,
            hintStyle: TextStyle(fontSize: 16),
            border: new OutlineInputBorder(
              borderRadius: const BorderRadius.all(
                const Radius.circular(10.0),
              ),
            ),
            filled: false,
            contentPadding: EdgeInsets.all(10),
          ),
        ),
      ),
    );
  }
}
