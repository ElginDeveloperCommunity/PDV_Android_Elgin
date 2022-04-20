export default class BridgeSatXml{
    constructor(){
        this.xml = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<CFe>'+
            '<infCFe Id="CFe13190814200166000166599000178400000148075811" versao="0.07" versaoDadosEnt="0.07" versaoSB="010103">'+
                '<ide>'
                    '<cUF>13</cUF>'+
                    '<cNF>807581</cNF>'+
                    '<mod>59</mod>'+
                    '<nserieSAT>900017840</nserieSAT>'+
                    '<nCFe>000014</nCFe>'+
                    '<dEmi>20190814</dEmi>'+
                    '<hEmi>163227</hEmi>'+
                    '<cDV>1</cDV>'+
                    '<tpAmb>2</tpAmb>'+
                    '<CNPJ>16716114000172</CNPJ>'+
                    '<signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC>'+
                    '<assinaturaQRCODE>kAmMUV2AFOP11vsbAwb4S1MrcnzIm8o6trefwjpRvpJaNGeXXcM2GKbs+aALc3WDxrimeOf9BdgoZl29RvtC1DmvqZ56oVEoRz0ymia1tHUdGPzuO035OuiEseEj3+gU+8NzGzqWQIJgqdgLOZgnmUP2aBOkC0QcokhHPVfwm9tJFQnQkzGzu4692+LtpxhLwEhnFjoZh+1hpBXn5AEcbMS4Lx751qvFlfZX0hsYJf5pKcFH88E3byU82MU8UD5p9fyX2qL5Ae+Uql1VLPqoJOsQmC2BCBkMW7oQRCCR0osz6eLX1DHHJU+stxKCkITlQnz6XJd4LKXifGZuZ25+Uw==</assinaturaQRCODE>'+
                    '<numeroCaixa>001</numeroCaixa>'+
                '</ide>'+
                '<emit>'+
                    '<CNPJ>14200166000166</CNPJ>'+
                    '<xNome>ELGIN INDUSTRIAL DA AMAZONIA LTDA</xNome>'+
                    '<enderEmit>'+
                        '<xLgr>AVENIDA ABIURANA</xLgr>'+
                        '<nro>579</nro>'+
                        '<xBairro>DIST INDUSTRIAL</xBairro>'+
                        '<xMun>MANAUS</xMun>'+
                        '<CEP>69075010</CEP>'+
                    '</enderEmit>'+
                    '<IE>111111111111</IE>'+
                    '<cRegTrib>3</cRegTrib>'+
                    '<indRatISSQN>N</indRatISSQN>'+
                '</emit>'+
                '<dest>'+
                    '<CPF>14808815893</CPF>'+
                '</dest>'+
                '<det nItem=1>'+
                    '<prod>'+
                        '<cProd>0000000000001</cProd>'+
                        '<xProd>PRODUTO NFCE 1</xProd>'+
                        '<NCM>94034000</NCM>'+
                        '<CFOP>5102</CFOP>'+
                        '<uCom>UN</uCom>'+
                        '<qCom>1.0000</qCom>'+
                        '<vUnCom>3.51</vUnCom>'+
                        '<vProd>3.51</vProd>'+
                        '<indRegra>T</indRegra>'+
                        '<vItem>3.00</vItem>'+
                        '<vRatDesc>0.51</vRatDesc>'+
                    '</prod>'+
                    '<imposto>'+
                        '<ICMS>'+
                            '<ICMS00>'+
                                '<Orig>0</Orig>'+
                                '<CST>00</CST>'+
                                '<pICMS>7.00</pICMS>'+
                                '<vICMS>0.21</vICMS>'+
                            '</ICMS00>'+
                        '</ICMS>'+
                        '<PIS>'+
                            '<PISAliq>'+
                                '<CST>01</CST>'+
                                '<vBC>6.51</vBC>'+
                                '<pPIS>0.0165</pPIS>'+
                                '<vPIS>0.11</vPIS>'+
                            '</PISAliq>'+
                        '</PIS>'+
                        '<COFINS>'+
                            '<COFINSAliq>'+
                                '<CST>01</CST>'+
                                '<vBC>6.51</vBC>'+
                                '<pCOFINS>0.0760</pCOFINS>'+
                                '<vCOFINS>0.49</vCOFINS>'+
                            '</COFINSAliq>'+
                        '</COFINS>'+
                    '</imposto>'+
                '</det>'+
                    '<total>'+
                        '<ICMSTot>'+
                            '<vICMS>0.21</vICMS>'+
                            '<vProd>3.51</vProd>'+
                            '<vDesc>0.00</vDesc>'+
                            '<vPIS>0.11</vPIS>'+
                            '<vCOFINS>0.49</vCOFINS>'+
                            '<vPISST>0.00</vPISST>'+
                            '<vCOFINSST>0.00</vCOFINSST>'+
                            '<vOutro>0.00</vOutro>'+
                        '</ICMSTot>'+
                        '<vCFe>3.00</vCFe>'+
                        '<DescAcrEntr>'+
                            '<vDescSubtot>0.51</vDescSubtot>'+
                        '</DescAcrEntr>'+
                        '<vCFeLei12741>0.56</vCFeLei12741>'+
                    '</total>'+
                    '<pgto>'+
                        '<MP>'+
                            '<cMP>01</cMP>'+
                            '<vMP>6.51</vMP>'+
                        '</MP>'+
                        '<vTroco>3.51</vTroco>'+
                    '</pgto>'+
                    '<infAdic>'+
                        '<infCpl>Trib aprox R$ 0,36 federal, R$ 1,24 estadual e R$ 0,00 municipal&lt;br&gt;CAIXA: 001 OPERADOR: ROOT</infCpl>'+
                        '<obsFisco xCampo="04.04.05.04">'+
                            '<xTexto>Comete crime quem sonega</xTexto>'+
                        '</obsFisco>'+
                    '</infAdic>'+
            '</infCFe>'+
            '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'+
                '<SignedInfo>'+
                    '<CanonicalizationMethod Algorithm=http://www.w3.org/TR/2001/REC-xml-c14n-20010315/>'+
                    '<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>'+
                    '<Reference URI="#CFe13190814200166000166599000178400000148075811">'+
                        '<Transforms>'+
                            '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>'+
                            '<Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'+
                        '</Transforms>'+
                        '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'+
                        '<DigestValue>rozf1i6JehNUqx8tfP1FG3QVUIxlrcHgozaB4LAjkDM=</DigestValue>'+
                    '</Reference>'+
                '</SignedInfo>'+
                '<SignatureValue>cAiGHfx3QxIhrmz3b36Z1EBs/TzLXKQkE5Ykn3Q1HOEKpshyZRaOLKlg6LiHjFgaZNKZnwWkKLQav2Af342Xc3XIkIjOF72vmLZxd/u6naZ3lYVWcf/G2YYdMpUAoqfpihLilVZZMqAIQQ/SW76mGstSI743lc0FL1NuMXSvAT3b9X1JcaC1r4uHezYGp/iSrX/lxfdnu4ZP2gzJ7KEnRvrTm9TCF3mA0zhDF5iem4vJC8bS/+OjhKhKfDeyxkrPDQc8+n7brALOYWbR3RUleMMKCIQf/nxaEy9XEsb53rC4KXLe5JL15YCxQ8TRYU6vvLoqFecd72HebFQ/C2BvgA==</SignatureValue>'+
                '<KeyInfo>'+
                    '<X509Data>'+
                        "<X509Certificate>MIIFzTCCBLWgAwIBAgICH9owDQYJKoZIhvcNAQENBQAwaDELMAkGA1UEBhMCQlIxEjAQBgNVBAgMCVNBTyBQQVVMTzESMBAGA1UEBwwJU0FPIFBBVUxPMQ8wDQYDVQQKDAZBQ0ZVU1AxDzANBgNVBAsMBkFDRlVTUDEPMA0GA1UEAwwGQUNGVVNQMB4XDTE5MDUxNjEyMjU1NFoXDTI0MDUxNDEyMjU1NFowgbIxCzAJBgNVBAYTAkJSMREwDwYDVQQIDAhBbWF6b25hczERMA8GA1UECgwIU0VGQVotU1AxGDAWBgNVBAsMD0FDIFNBVCBTRUZBWiBTUDEoMCYGA1UECwwfQXV0b3JpZGFkZSBkZSBSZWdpc3RybyBTRUZBWiBTUDE5MDcGA1UEAwwwRUxHSU4gSU5EVVNUUklBTCBEQSBBTUFaT05JQSBMVERBOjE0MjAwMTY2MDAwMTY2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuKdsN2mi5OserALssgKyPBZBnt3TeytHObTV2xboIeZ8nQ3qDbzovkpxwvBLEKCI1+5sWkZUBmQAqDXTv4Zu/oVPmgVAjLOQszH9mEkyrhlT5tRxyptGKCN58nfx150rHPvov9ct9uizR4S5+nDvMSLNVFpcpbT2y+vnfmMPQzOec8SbKdSPy1dytHl+id9r4XD/s/fXc19URb9XXtMui+praC9vWasiJsFScnTJScIdLwqZsCAmDQeRFHX1e57vCLNxFNCfKzgCRd9VhCQE03kXrz+xo7nJGdXP2baABvh3mi6ifHeuqPXw5JBwjemS0KkRZ5PhE5Ndkih86ZAeIwIDAQABo4ICNDCCAjAwCQYDVR0TBAIwADAOBgNVHQ8BAf8EBAMCBeAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBRS6g1qRE9lsk/8dfDlVjhISI/1wTAfBgNVHSMEGDAWgBQVtOORhiQs6jNPBR4tL5O3SJfHeDATBgNVHSUEDDAKBggrBgEFBQcDAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vYWNzYXQuZmF6ZW5kYS5zcC5nb3YuYnIvYWNzYXRzZWZhenNwY3JsLmNybDCBpwYIKwYBBQUHAQEEgZowgZcwNQYIKwYBBQUHMAGGKWh0dHA6Ly9vY3NwLXBpbG90LmltcHJlbnNhb2ZpY2lhbC5jb20uYnIvMF4GCCsGAQUFBzAChlJodHRwOi8vYWNzYXQtdGVzdGUuaW1wcmVuc2FvZmljaWFsLmNvbS5ici9yZXBvc2l0b3Jpby9jZXJ0aWZpY2Fkb3MvYWNzYXQtdGVzdGUucDdjMHsGA1UdIAR0MHIwcAYJKwYBBAGB7C0DMGMwYQYIKwYBBQUHAgEWVWh0dHA6Ly9hY3NhdC5pbXByZW5zYW9maWNpYWwuY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9hY3NhdHNlZmF6c3AvZHBjX2Fjc2F0c2VmYXpzcC5wZGYwJAYDVR0RBB0wG6AZBgVgTAEDA6AQDA4xNDIwMDE2NjAwMDE2NjANBgkqhkiG9w0BAQ0FAAOCAQEArHy8y6T6ZMX6qzZaTiTRqIN6ZkjOknVCFWTBFfEO/kUc1wFBTG5oIx4SDeas9+kxZzUqjk6cSsysH8jpwRupqrJ38wZir1OgPRBuGAPz9lcah8IL4tUQkWzOIXqqGVxDJ8e91MjIMWextZuy212E8Dzn3NNMdbqyOynd7O0O5p6wPS5nuTeEsm3wcw0aLu0bbIy+Mb/nHIqFKaoZEZ8LSYn2TfmP+z9AhOC1vj3swxuRTKf1xLcNvVbq/r+SAwwBC/IGRpgeMAzELLPLPUHrBeSO+26YWwXdxaq29SmEo77KkUpUXPlt9hS2MPagCLsE6ZwDSmc8x1h3Hv+MW8zxyg==</X509Certificate>"+
                    '</X509Data>'+
                '</KeyInfo>'+
            '</Signature>'+
        '</CFe>'
    }

    getXMLBridgeSAT(){
        return this.xml;
    }
}