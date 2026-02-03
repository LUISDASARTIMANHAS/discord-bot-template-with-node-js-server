// 400 Bad Request
// O servidor não pode ou não irá processar a solicitação devido a algo que é percebido como um erro do cliente (por exemplo, sintaxe de solicitação malformada, enquadramento de mensagem de solicitação inválida ou roteamento de solicitação enganosa).

// 401 Unauthorized
// Embora o padrão HTTP especifique "unauthorized", semanticamente, essa resposta significa "unauthenticated". Ou seja, o cliente deve se autenticar para obter a resposta solicitada.

// 402 Payment Required Experimental
// Este código de resposta está reservado para uso futuro. O objetivo inicial da criação deste código era usá-lo para sistemas digitais de pagamento, no entanto, este código de status é usado raramente e não existe nenhuma convenção padrão.

// 403 Forbidden
// O cliente não tem direitos de acesso ao conteúdo; ou seja, não é autorizado, portanto o servidor está se recusando a fornecer o recurso solicitado. Ao contrário do 401 Unauthorized, a identidade do cliente é conhecida pelo servidor.

// 404 Not Found
// O servidor não pode encontrar o recurso solicitado. No navegador, isso significa que o URL não é reconhecido. Em uma API, isso também pode significar que o endpoint é válido, mas o próprio recurso não existe. Os servidores também podem enviar esta resposta em vez de 403 Forbidden para ocultar a existência de um recurso de um cliente não autorizado. Este código de resposta é provavelmente o mais conhecido devido à sua ocorrência frequente na web.

// 405 Method Not Allowed
// O método de solicitação é conhecido pelo servidor, mas não é suportado pelo recurso de destino. Por exemplo, uma API pode não permitir chamar DELETE para remover um recurso.

// 406 Not Acceptable
// Esta resposta é enviada quando o servidor web, após realizar negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo que esteja em conformidade com os critérios fornecidos por o agente do usuário.

// 407 Proxy Authentication Required
// É semelhante a 401 Unauthorized, mas a autenticação precisa ser feita por um proxy.

// 408 Request Timeout
// Esta resposta é enviada por alguns servidores em uma conexão ociosa, mesmo sem qualquer requisição prévia pelo cliente. Isso significa que o servidor gostaria de desligar esta conexão não utilizada. Essa resposta é muito mais usada, pois alguns navegadores, como Chrome, Firefox 27+ ou IE9, usam mecanismos de pré-conexão HTTP para acelerar a navegação. Observe também que alguns servidores simplesmente encerram a conexão sem enviar esta mensagem.

// 409 Conflict
// Esta resposta será enviada quando uma requisição conflitar com o estado atual do servidor.

// 410 Gone
// Esta resposta é enviada quando o conteúdo solicitado foi excluído permanentemente do servidor, sem endereço de encaminhamento. Espera-se que os clientes removam seus caches e links para o recurso. A especificação HTTP pretende que esse código de status seja usado para "serviços promocionais por tempo limitado". As APIs não devem se sentir compelidas a indicar recursos que foram excluídos com esse código de status.

// 411 Length Required
// O servidor rejeitou a solicitação porque o campo de cabeçalho Content-Length não está definido e o servidor o exige.

// 412 Precondition Failed
// O cliente indicou nos seus cabeçalhos pré-condições que o servidor não atende.

// 413 Payload Too Large
// A entidade requisição é maior do que os limites definidos pelo servidor. O servidor pode fechar a conexão ou retornar um campo de cabeçalho Retry-After.

// 414 URI Too Long
// O URI solicitado pelo cliente é mais longo do que o servidor está disposto a interpretar.

// 415 Unsupported Media Type
// O formato de mídia dos dados requisitados não é suportado pelo servidor, portanto, o servidor está rejeitando a requisição.

// 416 Range Not Satisfiable
// O intervalo especificado pelo campo de cabeçalho Range na solicitação não pode ser atendido. É possível que o intervalo esteja fora do tamanho dos dados do URI de destino.

// 417 Expectation Failed
// Este código de resposta significa que a expectativa indicada pelo campo de cabeçalho de solicitação Expect não pode ser atendida pelo servidor.

// 418 I'm a teapot
// O servidor recusa a tentativa de coar café num bule de chá.

// 421 Misdirected Request
// A requisição foi direcionada a um servidor inapto a produzir a resposta. Pode ser enviado por um servidor que não está configurado para produzir respostas para a combinação de esquema e autoridade inclusas na URI da requisição.

// 422 Unprocessable Content (WebDAV)
// A solicitação foi bem formada, mas não pôde ser atendida devido a erros semânticos.

// 423 Locked (WebDAV)
// O recurso que está sendo acessado está bloqueado.

// 424 Failed Dependency (WebDAV)
// A solicitação falhou devido à falha de uma solicitação anterior.

// 425 Too Early Experimental
// Indica que o servidor não está disposto a correr o risco de processar uma solicitação que pode ser repetida.

// 426 Upgrade Required
// O servidor se recusa a executar a solicitação usando o protocolo atual, mas pode estar disposto a fazê-lo depois que o cliente atualizar para um protocolo diferente. O servidor envia um cabeçalho Upgrade em uma resposta 426 para indicar os protocolos necessários.

// 428 Precondition Required
// O servidor de origem exige que a solicitação seja condicional. Esta resposta destina-se a prevenir o problema de 'atualização perdida', onde um cliente pega (GET) o estado de um recurso, o modifica e o coloca (PUT) de volta no servidor, quando entretanto um terceiro modificou o estado no servidor, levando a um conflito.

// 429 Too Many Requests
// O usuário enviou muitas requisições num dado tempo ("limitação de frequência").

// 431 Request Header Fields Too Large
// O servidor não está disposto a processar a solicitação porque seus campos de cabeçalho são muito grandes. A solicitação pode ser reenviada após reduzir o tamanho dos campos do cabeçalho da solicitação.

// 451 Unavailable For Legal Reasons
// O agente do usuário solicitou um recurso que não pode ser fornecido legalmente, como uma página da Web censurada por um governo.

// Respostas de erro do servidor
// 500 Internal Server Error
// O servidor encontrou uma situação com a qual não sabe lidar.

// 501 Not Implemented
// O método da requisição não é suportado pelo servidor e não pode ser manipulado. Os únicos métodos que servidores devem suportar (e portanto não devem retornar este código) são GET e HEAD.

// 502 Bad Gateway
// Essa resposta de erro significa que o servidor, enquanto trabalhava como um gateway para obter uma resposta necessária para lidar com a solicitação, obteve uma resposta inválida.

// 503 Service Unavailable
// O servidor não está pronto para manipular a requisição Causas comuns são um servidor em manutenção ou sobrecarregado. Note que junto a esta resposta, uma página amigável explicando o problema deveria ser enviada. Esta resposta deve ser usada para condições temporárias e o cabeçalho HTTP Retry-After deverá, se possível, conter o tempo estimado para recuperação do serviço. O webmaster deve também tomar cuidado com os cabeçalhos relacionados com o cache que são enviados com esta resposta, já que estas respostas de condições temporárias normalmente não deveriam ser postas em cache.

// 504 Gateway Timeout
// Essa resposta de erro é fornecida quando o servidor está atuando como um gateway e não consegue obter uma resposta a tempo.

// 505 HTTP Version Not Supported
// A versão HTTP usada na requisição não é suportada pelo servidor.

// 506 Variant Also Negotiates
// O servidor tem um erro de configuração interna: o recurso variante escolhido está configurado para se envolver em negociação de conteúdo transparente e, portanto, não é um ponto final adequado no processo de negociação.

// 507 Insufficient Storage (WebDAV)
// O método não pôde ser executado no recurso porque o servidor não pode armazenar a representação necessária para concluir a solicitação com êxito.

// 508 Loop Detected (WebDAV)
// O servidor detectou um loop infinito ao processar a solicitação.

// 510 Not Extended
// Extensões adicionais à solicitação são necessárias para que o servidor a atenda.

// 511 Network Authentication Required
// Indica que o cliente precisa se autenticar para obter acesso à rede.
import * as bot from "./src/index.js";
import express from "express";
let app = express();
import {
  discordLogs,
  applyAutoMiddlewares
} from "npm-package-nodejs-utils-lda";

// configs e modulos extras
import dotenv from "dotenv";
dotenv.config();
import ddosModule from "./modules/ddosModule.js";
// const hostname = "127.0.0.1"; só local
// const hostname = "0.0.0.0"; Bind na placa de rede
// const hostname = "::"; bind ipv4 e ipv6 pra fora
const hostname = "::";
// 0 força o express a pegar uma porta aleatora
const porta = process.env.PORT;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(ddosModule().express);

applyAutoMiddlewares(app);

var server = app.listen(porta || 0, hostname, function () {
  // Corrige: server.address() pode ser null se o bind falhar
  const addr = server.address();

  if (!addr) {
    console.warn(
      "⚠️  Falha ao obter endereço do servidor (server.address() retornou null)"
    );
    console.warn(
      "Verifique se a porta já está em uso ou se o IPv6 está ativado."
    );
    return;
  }

  const host = addr.address;
  const port = addr.port;

  // Ajuste: se for IPv6, exibir com colchetes [::1]
  const displayHost = host.includes(":") ? `[${host}]` : host;

  console.log("Servidor rodando em http://localhost:%s", port);
  console.log("IP Obtido: http://%s:%s", displayHost, port);
  discordLogs("START", `Servidor rodando em http://localhost:${port}`);
});
