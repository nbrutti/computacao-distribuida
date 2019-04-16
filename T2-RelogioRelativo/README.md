# Descrição

Demonstração de um relógio relativo, utilizando relógios vetoriais. Cada processo é executado em uma máquina, a comunicação funciona através de sockets UDPv4. Cada processo instanciado ao gerar um evento (solicitação de envio de mensagens, recebimento de mensagens) incrementa seu relógio em uma unidade. Quando um processo P envia uma mensagem, um pacote é criado contendo as informações do destinatário e o vetor de relógios atual do processo P. No momento que o destinatário estiver disponível (i.e, escutando na porta informada) ele envia o ACK para a origem e faz o merge entre seu vetor de relógios e o contido no pacote recebido.

# Executar:

```javascript
$ node client.js --port=P{0}_HOST:P{0}_PORT --neighboors=P{0}_HOST:P{0}_PORT,P{1}_HOST:P{1}_PORT,...,P{N}_HOST:P{N}_PORT
```

# Links úteis
[Video aula sobre Vetores de Relógio Lógicos](https://www.youtube.com/watch?v=jD4ECsieFbE)