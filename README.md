# Testes de carga com K6

## Que diabos K6

[K6](https://k6.io/docs/) uma ferramenta de teste carga gratuita e open-source. Desenvolvido para rodar testes de alta carga (spike, stress e soak) em ambientes de pré-produção e QA.
Também oferece primitivos para monitoramento de testes.

> Nota: Dentre as possibilidades de export dos resultados temos: CloudWatchm Kafka, Datadog, New Relic, além de json e csv e outros.

## Como criar o teste

Primeiramente, é necessário criar o script (javascript) que será executado pela ferramenta.

[Doc da API JavaScript do K6](https://k6.io/docs/javascript-api)

## Instalando e rodando o teste

Você pode instalar o k6 na sua máquina ou pode rodar utilizando uma imagem docker. Vide [instruções](https://k6.io/docs/getting-started/installation).

> As instruções seguintes consideram que estará utilizando docker para rodar os testes

Como experimento, crie um arquivo simples:

```javascript
// script.js

export default function () {
    console.log("[INFO] Yep, it works!!")
}
```

E tente rodar:

```bash
docker run -i loadimpact/k6 run - <script.js
```

ou

```bash
docker run -v "$(pwd)":/test -i loadimpact/k6 run /test/script.js
```

## Calculando a quantidade de Vus

- [Cálcular RPS](https://k6.io/blog/ref-how-to-generate-a-constant-request-rate-in-k6)
- [RPS constante](https://k6.io/blog/how-to-generate-a-constant-request-rate-with-the-new-scenarios-api)

```text
Request Rate = (VU * R) / T

Onde:
T = (R * http_req_duration) + 1s

- Request Rate: measured by the number of requests per second (RPS)
- VU: the number of virtual users
- R: the number of requests per VU iteration
- T: a value larger than the time needed to complete a VU iteration
```

Passos

1. Já temos `R` que é definido pelo script.

1. Calculamos `T`, que é dado pela quantidade de requisições vezes o tempo esperado para que elas aconteçam mais uma brecha de delay.

1. Decida quantos RPS deseja atingir.

1. E substitua na fórmula acima.

Exemplo:

```text
Considerando que temos um teste que faz 10 requisições 
e que cada leva cerca de 30ms e que queremos atingir
cerca de 1000 rps (60000 rpm).

R = 10
T = 10 * 30ms (0,5s) + 1 = 6s
RPS = 1000

VU = RPS * T / R = 1000 * 6 / 10 = 600
```

## Integração com o Grafana

Rode o grafana

```bash
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```
