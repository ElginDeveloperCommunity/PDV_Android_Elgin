using Xamarin.Forms;
using System;
using M8XamarinForms.Kiosk;
using Com.Elgin.E1.Core;

[assembly: Dependency(typeof(M8XamarinForms.Droid.IKioskImplementaion))]
namespace M8XamarinForms.Droid
{
    class IKioskImplementaion : IKiosk
    {
        private readonly Utils utils;

        public IKioskImplementaion()
        {
            utils = new Utils((MainActivity)Forms.Context);
        }

        // Desabilita todas as configurações de Kiosk.
        public void ResetKioskMode()
        {
            ExecuteKioskOperation(KioskConfig.BARRA_STATUS, true);
            ExecuteKioskOperation(KioskConfig.BARRA_NAVEGACAO, true);
            ExecuteKioskOperation(KioskConfig.BOTAO_POWER, true);
        }

        public void ExecuteKioskOperation(KioskConfig kioskConfig, bool enable)
        {
            try
            {
                KioskOperation(kioskConfig, enable);
            }
            catch (Exception e)
            {
                throw new InvalidOperationException("Exceção inesperada ao executar operação kiosk: " + e);
            }
        }

        private void KioskOperation(KioskConfig kioskConfig, bool enable)
        {
            switch (kioskConfig) {
                case KioskConfig.BARRA_STATUS:
                    ToggleBarraStatus(enable);
                    break;
                case KioskConfig.BARRA_NAVEGACAO:
                    ToggleBarraNavegacao(enable);
                    break;
                case KioskConfig.BOTAO_POWER:
                    ToggleBotaoPower(enable);
                    break;
                default:
                    throw new InvalidOperationException("Operação inesperada: " + kioskConfig);
            }
        }

        private void ToggleBotaoPower(bool enable)
        {
            if (enable)
            {
                utils.HabilitaBotaoPower();
            }
            else
            {
                utils.DesabilitaBotaoPower();
            }
        }

        private void ToggleBarraNavegacao(bool enable)
        {
            if (enable) {
                utils.HabilitaBarraNavegacao();
            } else {
                utils.DesabilitaBarraNavegacao();
            }
}       

        private void ToggleBarraStatus(bool enable)
        {
            if (enable) {
                utils.HabilitaBarraStatus();
            } else {
                utils.DesabilitaBarraStatus();
            }
        }
    }
}