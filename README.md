# Testes de carga com K6

## Requerimentos

- [Docker](https://www.docker.com/)

## Que diabos K6

[K6](https://k6.io/docs/) uma ferramenta de teste carga gratuita e open-source. Desenvolvido para rodar testes de alta carga (spike, stress e soak) em ambientes de pré-produção e QA.
Também oferece primitivos para monitoramento de testes.

> Nota: Dentre as possibilidades de export dos resultados temos: CloudWatch, Kafka, Datadog, New Relic, além de json e csv e outros.

## Instalação

Você pode instalar o k6 na sua máquina ou pode rodar utilizando uma imagem docker. Vide [instruções](https://k6.io/docs/getting-started/installation).

> As instruções seguintes consideram que estará utilizando docker para rodar os testes

Os testes com K6 são escritos em JavaScript. Como experimento, crie um arquivo simples:

```javascript
// script.js

export default function () {
    console.log("[INFO] Yep, it works!!")
}
```

E tente rodar:

```bash
docker run -v "$(pwd)":/test -i loadimpact/k6 run /test/script.js
```

## Rodando integração com o Grafana

A integração com o Grafana faz uso do InfluxDB, um banco de dados de séries de temporais.

1. Rode o Grafana e o InfluxDB

    ```bash
    docker-compose up -d grafana influxdb
    ```

2. Acesse o [Grafana](http://localhost:3000) e para o login use:

    ```text
        Usuário: admin
        Senha:   admin
    ```

3. Configure o datasource no Grafana em [`Configuration > Data Sources > Add data source > Time series databases > InfluxDB`](http://localhost:3000/datasources/new) com valores

    ```text
        HTTP > URL:                  http://k6_influxdb:8086
        InfluxDB Details > Database: myk6db
    ```

    ![Influx](assets/influx_config.png)

4. A [doc](https://k6.io/docs/results-visualization/influxdb-+-grafana/#preconfigured-grafana-dashboards) disponibiliza links para alguns dashboards já prontos. Teste importar com o dashboard [10660](https://grafana.com/grafana/dashboards/10660) em [`Create > Import > Import via grafana.com`](http://localhost:3000/dashboard/import) selecionando o datasource criado no passo anterior em `InfluxDB`.

5. Rode o script de teste

    ```bash
    docker-compose up k6
    ```

6. Acompanhe o [dashboard](http://localhost:3000/d/XKhgaUpik) no Grafana! Você o encontrará em [`Dashboards > Manage`](http://localhost:3000/dashboards)

## Calculando a quantidade de Vus

> Nota: Agora temos opções de `scenarios` que deixam a gente controlar a quantidade de rps. O exemplo da próxima sessão apresentará como exemplo.

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

## Outros

[Doc da API JavaScript do K6](https://k6.io/docs/javascript-api)
