# Decrição

Trata-se de uma aplicação de comunicação através de sockets UDP/IPv4. Cada nó (cliente) é capaz de enviar e receber pacotes. Cada pacote é composto por: host destino, porta destino e a mesagem.

Ao solicitar o envio de um pacote o mesmo é encaminhado a uma fila. Um agendamento percorre esta fila a cada 5 segundos e faz o envio dos pacotes ao devido destinatário. Quando o pacote chega ao destino, uma confirmação é enviada a origem, solicitando a remoção deste pacote da lista de espera.

# Instalar dependências:
```bash
$ yarn install
```

# Executar:

```javascript
$ node client.js --port=NUMBER
```

# Links
[Node.js: installation guide](https://nodejs.org/en/download/package-manager/)
[Node.js: docs](https://nodejs.org/en/docs/)