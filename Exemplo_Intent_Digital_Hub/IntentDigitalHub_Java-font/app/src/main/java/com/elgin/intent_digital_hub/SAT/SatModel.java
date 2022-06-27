package com.elgin.intent_digital_hub.SAT;

/**
 * Os dois modelos diferentes de SAT possuem xmls diferentes no envio de venda, o enumerator facilita guardando também o nome dos arquivos xml de envio de envio de venda para cada modelo, encontrados em res/raw/
 */

public enum SatModel {
    SMART_SAT("sat_enviar_dados_venda"),
    SAT_GO("satgo_enviar_dados_venda");

    final private String SALE_XML_ARCHIVE_NAME;

    SatModel(String SALE_XML_ARCHIVE_NAME) {
        this.SALE_XML_ARCHIVE_NAME = SALE_XML_ARCHIVE_NAME;
    }

    public String getSALE_XML_ARCHIVE_NAME() {
        return SALE_XML_ARCHIVE_NAME;
    }
}