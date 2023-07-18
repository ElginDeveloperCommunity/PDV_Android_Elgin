import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/services/service_kiosk.dart';

class KioskMode extends StatefulWidget {
  @override
  _KioskModeState createState() => _KioskModeState();
}

class _KioskModeState extends State<KioskMode> {
  bool isNavigationBarEnabled = true;
  bool isStatusBarEnabled = true;
  bool isPowerButtonEnabled = true;

  KioskModeService kioskModeService = KioskModeService();

  void setFullKioskMode() {
    setState(() {
      isNavigationBarEnabled = false;
      isStatusBarEnabled = false;
      isPowerButtonEnabled = false;
      kioskModeService.fullModoKiosk();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.fromLTRB(10.0, 30.0, 10.0, 10.0),
        children: [
          Container(
            height: 50,
            color: Colors.grey[300],
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  child: Text(
                    'Kiosk Mode Title',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 24,
                      color: Colors.black,
                      fontFamily: 'RobotoBold',
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 3.0),
                  child: Image.asset(
                    'assets/images/elgin_logo.png', // Replace with the actual image asset path
                    height: 30,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 70),
          Card(
            elevation: 10,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            child: SwitchListTile(
              title: Text(
                'Navigation Bar',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              value: isNavigationBarEnabled,
              onChanged: (value) {
                setState(() {
                  isNavigationBarEnabled = value;
                  kioskModeService.toggleBarraNavagacao(isNavigationBarEnabled);
                });
              },
            ),
          ),
          SizedBox(height: 10),
          Card(
            elevation: 10,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            child: SwitchListTile(
              title: Text(
                'Status Bar',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              value: isStatusBarEnabled,
              onChanged: (value) {
                setState(() {
                  isStatusBarEnabled = value;
                  kioskModeService.toggleBarraStatus(isStatusBarEnabled);
                });
              },
            ),
          ),
          SizedBox(height: 10),
          Card(
            elevation: 10,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            child: SwitchListTile(
              title: Text(
                'Power Button',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              value: isPowerButtonEnabled,
              onChanged: (value) {
                setState(() {
                  isPowerButtonEnabled = value;
                  kioskModeService.toggleBotaoPower(isPowerButtonEnabled);
                });
              },
            ),
          ),
          SizedBox(height: 80),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    kioskModeService.undoFullModoKiosk();
                    Navigator.pop(context);
                  },
                  child: Text('Back'),
                ),
              ),
              SizedBox(width: 10),
              Expanded(
                child: ElevatedButton(
                  onPressed: setFullKioskMode,
                  child: Text('FULL KIOSK'),
                ),
              ),
            ],
          ),
          GeneralWidgets.baseboard(),
        ],
      ),
    );
  }
}
