# Elgin Web App Apk

A aplicação desenvolvida é capaz de abrir um link URL e escutar suas chamadas Javascript e executar funcionalidades em dispositivos Android Elgin, caso as chamadas sejam realizadas corretamente, conforme descrito a seguir.

## Configuração da Aplicação
A aplicação possui o seguinte funcionamento: ao ser iniciada pela primeira vez a aplicação irá pedir acesso a escrita de arquivos, uma vez concedida a permissão a aplicação por meio de um alert irá pedir para escrever o link da URL que ela deverá carregar. 
Essa URL será escrita em um arquivo .txt no mesmo nível da pasta Downloads, Android e etc, com o nome URLfile.txt
Caso se queira mudar o endereço web a ser acessado pela aplicação, deverá mudar o conteúdo desse arquivo de texto.

## Padrão de Envio/Retorno das chamdas
As chamadas Javascript devem ser feitas por cima das interfaces disponíveis na aplicação e com parâmetros Json como string.
A interfaces implementadas e disponíveis até o presente momento são:

* Termica
* Sat

As chamadas devem ser feitas como função da interface, com o nome da função exatamente como listado na [documentação](https://elgindevelopercommunity.github.io).

Exemplo:

```javascript 
let args = JSON.stringify({ tipo: 5, modelo: '', conexao: '', parametro: 0 })
let resultado = Termica.AbreConexaoImpressora(args)
```

Obs: Lembre-se de consultar a documentação para ver os parâmetros corretos para cada função.
<br>
No resultado da operação virá um Json, em string, com três parâmetros:

1. `callResult`: string['success', 'failed'] = Indica o sucesso ou falha da operação, é importante notar que este parâmetro indica se a operação foi realizada ou não, e não necessariamente que a função chamada obteve sucesso. Um callResult com o valor 'failed' indica, com toda certeza, que um parâmetro incorreto foi enviado para a função, seja a falta de um parâmetro, ou tipagem incorreta.
2. `callResultCode`: int[0, 1000, 1001, 1002] = Indica o código-resultado da operação, existe para facilitar um possível tratamento de erro.
	
| callResultCode | Significado |
| :---: | :---- |
| 0 | Sucesso total da operação |
| 1000 | Parâmetro enviado não corresponde a uma string em formato Json |
| 1001 | Parâmetro obrigatório para a função ausente no Json enviado |
| 1002 | Parâmetro obrigatório com formato inválido. Ex: Um valor que deveria ser inteiro ser enviado como '2a', o que seria impossível de converter para inteiro e resultaria em uma NumberFormatException. |
	
3. callReturn: string - Caso a função tenha obtido sucesso (callResult == 'success') este campo retornará o retorno da função requisitada, como string. (Para a função AbreConexaoImpressora por exemplo, o retorno será um inteiro, como a documentação especifica.)
Caso a função não tenha obtido sucesso, (callResult == 'failed') este campo conterá uma descrição mínima do erro. (Conterá os parâmtros envolvidos no erro da operação em um array, juntamente com uma descrição do erro).
	
Exemplos:

Operação enviada com nome correto, e todos os parâmetros corretamente:
```json
{"callResult":"success","callResultCode":0,"callReturn":"0"}
```

Operação enviada com parâmetro jsonString esperada em formato fora dos padrões Json:
```json
{"callResult":"failed","callResultCode":1000,"callReturn":"invalid_json_string"}

```

Operação AbreConexaoImpressora enviada com parâmetro 'tipo' ausente:
```json
{"callResult":"failed","callResultCode":1001,"callReturn":"missing_required_parameters : [tipo]"}

```

Operação AbreConexaoImpressora enviada com parâmetro 'modelo' ausente:
```json
{"callResult":"failed","callResultCode":1001,"callReturn":"missing_required_parameters : [modelo]"}
```

Operação AbreConexaoImpressora enviada com parâmetro 'tipo' e 'modelo' ausentes:
```json
{"callResult":"failed","callResultCode":1001,"callReturn":"missing_required_parameters : [tipo, modelo]"}
```

Operação AbreConexaoImpressora enviada com parâmetro tipo (que deve ser, obrigatoriamente, inteiro) inválido.
```json
{"callResult":"failed","callResultCode":1002,"callReturn":"invalid_parameters : [tipo]"}
```

**Até o presente momento, as seguintes função estão registradas e, portando, disponíveis.

1. Termica
AbreConexaoImpressora
AbreGavetaElgin
AvancaPapel
Corte 
DefinePosicao
FechaConexaoImpressora
ImpressaoQRCode
ImpressaoTexto
StatusImpressora

2. Sat
AssociarAssinatura
AtivarSAT
CancelarVenda
ConsultarSAT
ConsultarStatusOperacional
EnviarDadosVenda
ExtrairLogs
