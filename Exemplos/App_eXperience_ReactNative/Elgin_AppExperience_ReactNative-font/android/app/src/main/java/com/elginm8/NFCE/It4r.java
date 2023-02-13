package com.elginm8.NFCE;

import androidx.annotation.NonNull;

import java.util.concurrent.atomic.AtomicLong;

import br.com.daruma.framework.mobile.DarumaMobile;
import br.com.daruma.framework.mobile.exception.DarumaException;

/**
 * A implementação dos métodos da DarumaMobileFramework exigem que os métodos que possuem requisição aos webservices sejam executados em threads
 * e por isto, para que possíveis exceções jogadas dentro da threads sejam capturadas foi criada um objeto de controle, que externaliza os exceções
 * para tratamentos de erro e/ou mensagens de erro.
 */

public final class It4r extends It4rAbstract {
    //Valor utilizado para guardar o valor do tempo de emissão
    private static AtomicLong timeElapsedInLastEmission = new AtomicLong(0);
    //Obtejo utilizada para verificar se houve alguma exceção nas threads que executam as funções DarumaMobile
    private static volatile DarumaException capturedException = null;

    public It4r(@NonNull DarumaMobile dmfObject) {
        super(dmfObject);
    }

    @Override
    public void venderItem(String descricao, String valor, String codigo) throws DarumaException {
        Thread sellItemThread = new Thread(() ->
        {
            try {
                if (dmf.rCFVerificarStatus_NFCe() < 2)
                    dmf.aCFAbrir_NFCe("", "", "", "", "", "", "", "", "");

                dmf.aCFConfICMS00_NFCe("0", "00", "3", "17.50");
                dmf.aCFConfPisAliq_NFCe("01", "10.00");
                dmf.aCFConfCofinsAliq_NFCe("01", "10.00");
                dmf.aCFVenderCompleto_NFCe("17.50", "1.00", valor, "D$", "0.00", codigo, "21050010", "5102", "UN", descricao, "CEST=2300100;cEAN=SEM GTIN;cEANTrib=SEM GTIN;");
            } catch (DarumaException darumaException) {
                darumaException.printStackTrace();
                It4r.capturedException = darumaException;
            }
        });

        sellItemThread.start();

        try {
            sellItemThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if (capturedException != null)
            throwExceptionAndResetCapture();
    }

    @Override
    public void encerrarVenda(String valorTotal, String formaPagamento) throws DarumaException {
        Thread finishSaleThread = new Thread(() ->
        {
            try {
                if (Float.parseFloat(valorTotal) < 0.01f) {
                    throw new IllegalArgumentException("Valor não aceito para o encerramento de venda!");
                }
                dmf.aCFTotalizar_NFCe("D$", "0.00");
                dmf.aCFEfetuarPagamento_NFCe(formaPagamento, valorTotal);

                timeElapsedInLastEmission = new AtomicLong(0);
                long startTime = System.currentTimeMillis();

                dmf.tCFEncerrar_NFCe("ELGIN DEVELOPERS COMMUNITY");

                long endTime = System.currentTimeMillis();

                timeElapsedInLastEmission = new AtomicLong(endTime - startTime);

                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EstadoCFe", "0");
            } catch (DarumaException darumaException) {
                darumaException.printStackTrace();
                It4r.capturedException = darumaException;
            }
        });

        finishSaleThread.start();

        try {
            finishSaleThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


        if (capturedException != null)
            throwExceptionAndResetCapture();
    }

    public void configurarXmlNfce() throws DarumaException {
        Thread configurateXmlNfceThread = new Thread(() ->
        {
            try {
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EmpPK", "YPxRwGxIbpWZtwhuC0m+Wg==", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EmpCK", "eKdz2fcZg9ZMt3DrfF/KSIVoH59Ca6nN", false);
                dmf.RegAlterarValor_NFCe("IDE\\cUF", "43", false);
                dmf.RegAlterarValor_NFCe("EMIT\\CNPJ", "06354976000149", false);
                dmf.RegAlterarValor_NFCe("EMIT\\IE", "1470049241", false);
                dmf.RegAlterarValor_NFCe("EMIT\\xNome", "ITFast", false);
                dmf.RegAlterarValor_NFCe("EMIT\\ENDEREMIT\\UF", "RS", false);
                dmf.RegAlterarValor_NFCe("EMIT\\CRT", "3", false);
                dmf.RegAlterarValor_NFCe("EMIT\\CRT", "3", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\TipoAmbiente", "2", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\Impressora", "EPSON", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\AvisoContingencia", "1", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\ImpressaoCompleta", "2", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\NumeracaoAutomatica", "1", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\HabilitarSAT", "0", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\IdToken", "000001", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\Token", "1A451E99-0FE0-4C13-B97E-67D698FFBC37", false);
                dmf.RegAlterarValor_NFCe("IDE\\Serie", "133", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\NT\\VersaoNT", "400", false);
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EstadoCFe", "0", false);
                dmf.RegPersistirXML_NFCe();

                adjustNfceNumber();
            } catch (DarumaException darumaException) {
                darumaException.printStackTrace();
                It4r.capturedException = darumaException;
            }
        });

        configurateXmlNfceThread.start();

        try {
            configurateXmlNfceThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if (capturedException != null)
            throwExceptionAndResetCapture();
    }

    private void throwExceptionAndResetCapture() throws DarumaException {
        DarumaException lastException = capturedException;
        capturedException = null;
        throw lastException;
    }

    public String getNumeroNota() {
        char[] numeroNota = new char[50];
        dmf.rInfoEstendida_NFCe("2", numeroNota);

        return String.valueOf(numeroNota).trim();
    }

    public String getNumeroSerie() {
        char[] serieNota = new char[50];
        dmf.rInfoEstendida_NFCe("5", serieNota);

        return String.valueOf(serieNota).trim();
    }

    public AtomicLong getTimeElapsedInLastEmission() {
        return timeElapsedInLastEmission;
    }

    //Função que busca a informação da nota mais alta pra série já escrita NFC-e para envio em cache, impedindo erro de duplicidade de NFC-e
    public void adjustNfceNumber() throws DarumaException {
        char[] retorno = new char[50];
        dmf.rRetornarInformacao_NFCe("NUM", "0", "0", "133", "", "9", retorno);
        String retornoAjustado = new String(retorno).trim();
        String notaMaisAlta = retornoAjustado.replaceAll("\\D+", "");
        int notaMaisAltaInt = Integer.parseInt(notaMaisAlta) + 1;
        String proximaNota = String.valueOf(notaMaisAltaInt);

        dmf.RegAlterarValor_NFCe("IDE\\nNF", proximaNota);
        dmf.RegPersistirXML_NFCe();
    }

}
