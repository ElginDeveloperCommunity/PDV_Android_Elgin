export default class BridgeNFCeXml{
    constructor(){
        this.xml = '<?xml version="1.0" encoding="utf-8"?>'+
        '<NFe xmlns="http://www.portalfiscal.inf.br/nfe">'+
            '<infNFe Id="NFe13220114200166000166650070000001029870832698" versao="4.00">'+
                '<ide>'+
                    '<cUF>13</cUF>'+
                    '<cNF>87083269</cNF>'+
                    '<natOp>venda</natOp>'+
                    '<mod>65</mod>'+
                    '<serie>7</serie>'+
                    '<nNF>102</nNF>'+
                    '<dhEmi>2022-01-26T11:38:37-03:00</dhEmi>'+
                    '<tpNF>1</tpNF>'+
                    '<idDest>1</idDest>'+
                    '<cMunFG>1302603</cMunFG>'+
                    '<tpImp>4</tpImp>'+
                    '<tpEmis>1</tpEmis>'+
                    '<cDV>8</cDV>'+
                    '<tpAmb>2</tpAmb>'+
                    '<finNFe>1</finNFe>'+
                    '<indFinal>1</indFinal>'+
                    '<indPres>1</indPres>'+
                    '<procEmi>0</procEmi>'+
                    '<verProc>pynota 0.1.0</verProc>'+
                    '<dhCont>2022-01-26T11:38:38-03:00</dhCont>'+
                    '<xJust>Conexão com a sefaz indisponível</xJust>'+
                '</ide>'+
                '<emit>'+
                    '<CNPJ>14200166000166</CNPJ>'+
                    '<xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome>'+
                    '<xFant>Elgin S/A</xFant>'+
                    '<enderEmit>'+
                        '<xLgr>Avenida Manaus Dois Mil</xLgr>'+
                        '<nro>1</nro>'+
                        '<xBairro>Japiim</xBairro>'+
                        '<cMun>1302603</cMun>'+
                        '<xMun>Manaus</xMun>'+
                        '<UF>AM</UF>'+
                        '<CEP>69076448</CEP>'+
                        '<cPais>1058</cPais>'+
                        '<xPais>Brasil</xPais>'+
                        '<fone>1133835816</fone>'+
                    '</enderEmit>'+
                    '<IE>062012991</IE>'+
                    '<IM>793</IM>'+
                    '<CNAE>6202300</CNAE>'+
                    'CRT>3</CRT>'+
                '</emit>'+
                '<det nItem="1">'+
                    '<prod>'+
                        '<cProd>123</cProd>'+
                        '<cEAN>SEM GTIN</cEAN>'+
                        '<xProd>NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xProd>'+
                        '<NCM>22030000</NCM>'+
                        '<CEST>0302100</CEST>'+
                        '<indEscala>S</indEscala>'+
                        '<CFOP>5102</CFOP>'+
                        '<uCom>UN</uCom>'+
                        '<qCom>1</qCom>'+
                        '<vUnCom>1</vUnCom>'+
                        '<vProd>1.00</vProd>'+
                        '<cEANTrib>5000000000357</cEANTrib>'+
                        '<uTrib>UN</uTrib>'+
                        '<qTrib>1</qTrib>'+
                        '<vUnTrib>1</vUnTrib>'+
                        '<indTot>1</indTot>'+
                    '</prod>'+
                    '<imposto>'+
                        '<ICMS>'+
                            '<ICMS40>'+
                                '<orig>0</orig>'+
                                '<CST>41</CST>'+
                            '</ICMS40>'+
                        '</ICMS>'+
                        '<PIS>'+
                            '<PISAliq>'+
                                '<CST>01</CST>'+
                                '<vBC>1.00</vBC>'+
                                '<pPIS>1.6500</pPIS>'+
                                '<vPIS>0.02</vPIS>'+
                            '</PISAliq>'+
                        '</PIS>'+
                        '<COFINS>'+
                            '<COFINSAliq>'+
                                '<CST>01</CST>'+
                                '<vBC>1.00</vBC>'+
                                '<pCOFINS>7.6000</pCOFINS>'+
                                '<vCOFINS>0.08</vCOFINS>'+
                            '</COFINSAliq>'+
                        '</COFINS>'+
                    '</imposto>'+
                '</det>'+
                '<total>'+
                    '<ICMSTot>'+
                        '<vBC>0.00</vBC>'+
                        '<vICMS>0.00</vICMS>'+
                        '<vICMSDeson>0.00</vICMSDeson>'+
                        '<vFCP>0.00</vFCP>'+
                        '<vBCST>0.00</vBCST>'+
                        '<vST>0.00</vST>'+
                        '<vFCPST>0.00</vFCPST>'+
                        '<vFCPSTRet>0.00</vFCPSTRet>'+
                        '<vProd>1.00</vProd>'+
                        '<vFrete>0.00</vFrete>'+
                        '<vSeg>0.00</vSeg>'+
                        '<vDesc>0.00</vDesc>'+
                        '<vII>0.00</vII>'+
                        '<vIPI>0.00</vIPI>'+
                        '<vIPIDevol>0.00</vIPIDevol>'+
                        '<vPIS>0.02</vPIS>'+
                        '<vCOFINS>0.08</vCOFINS>'+
                        '<vOutro>0.00</vOutro>'+
                        '<vNF>1.00</vNF>'+
                        '<vTotTrib>0.00</vTotTrib>'+
                    '</ICMSTot>'+
                '</total>'+
                '<transp>'+
                    '<modFrete>9</modFrete>'+
                    '<vol>'+
                        '<qVol>12</qVol>'+
                        '<esp>VOL</esp>'+
                        '<marca>Elgin SA</marca>'+
                        '<nVol>0 A 0</nVol>'+
                        '<pesoL>20.123</pesoL>'+
                        '<pesoB>30.123</pesoB>'+
                        '<lacres>'+
                            '<nLacre>3000</nLacre>'+
                        '</lacres>'+
                    '</vol>'+
                '</transp>'+
                '<pag>'+
                    '<detPag>'+
                        '<indPag>0</indPag>'+
                        '<tPag>01</tPag>'+
                        '<vPag>1.00</vPag>'+
                    '</detPag>'+
                    '<vTroco>0.00</vTroco>'+
                '</pag>'+
                '<infRespTec>'+
                    '<CNPJ>29604796000173</CNPJ>'+
                    '<xContato>riosoft</xContato>'+
                    '<email>contato@veraciti.com.br</email>'+
                    '<fone>92998745445</fone>'+
                    '<idCSRT>12</idCSRT>'+
                    '<hashCSRT>qvTGHdzF6KLavt4PO0gs2a6pQ00=</hashCSRT>'+
                '</infRespTec>'+
            '</infNFe>'+
            '<infNFeSupl>'+
                '<qrCode>https://sistemas.sefaz.am.gov.br/nfceweb-hom/consultarNFCe.jsp?p=13220114200166000166650070000001029870832698|2|2|26|1.00|6c4e62336b4d4f33365966626f4f4168556473767244695233674d3d|1|CCE5214E1F0BB8B6AB4F14B348C65F61C90551E2</qrCode>'+
                '<urlChave>www.sefaz.am.gov.br/nfce/consulta</urlChave>'+
            '</infNFeSupl>'+
            '<Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#">'+
                '<SignedInfo>'+
                    '<CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'+
                    '<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>'+
                    '<Reference URI="#NFe13220114200166000166650070000001029870832698">'+
                        '<Transforms>'+
                            '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>'+
                            '<Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'+
                        '</Transforms>'+
                        '<DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>'+
                        '<DigestValue>lNb3kMO36YfboOAhUdsvrDiR3gM=</DigestValue>'+
                    '</Reference>'+
                '</SignedInfo>'+
                '<SignatureValue>ImcjGhmNZQDDfahkYGHecWYBk4/LwNql3JscIK3wz5igswa5YA3q9RSqbvP4hUhubN8KowfvRqtvpteCteYp1afxWlBAkPx5CmVDMiweyya5CRlfZlDF37sE6deHQkI3kQ9hOKCNsZn2lmanPeiV1YJkwjMhiY3GnLVQDxeu8fJqr9MALXa5gaOe7WWFyCTd/B+9MQjhEKAnf4SdmyC7VLbBIY5lYWVvjPvoisThAShVZdn7IDI2AzKAIEmAl7QJWHplKZ1oylRti+l/DUVQzvG8xNq3pzHHeXIcmlgIONG+HSNeaQZ8OLJ2r9RgpRy+H+mHIEyjS/qtCPG1Bi70ow==</SignatureValue>'+
                '<KeyInfo>'+
                    '<X509Data>'+
                        '<X509Certificate>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</X509Certificate>'+
                    '</X509Data>'+
                '</KeyInfo>'+
            '</Signature>'+
        '</NFe>'
              
    }

    getXMLBridgeNFCe(){
        return this.xml;
    }
}