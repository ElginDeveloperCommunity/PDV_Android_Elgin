using System;
using System.Collections.Generic;
using System.Text;

namespace M8XamarinForms.Kiosk
{
    public interface IKiosk
    {
        public void ResetKioskMode();

        public void ExecuteKioskOperation(KioskConfig kioskConfig, bool enable);
    }
}
