# Docker

----
## Requisitos:
> **[Docker](https://docs.docker.com/)**

> **[docker-compose](https://docs.docker.com/compose/)**


----
## Como usar

#### Como iniciar o serviço:

    $ docker-compose up

*em background (detached mode)*

    $ docker-compose up -d

#### Como parar o serviço:

*caso não tenha iniciado os containers em background (detached mode)*

    ctrl+c

*Ou independentemente da forma que os containers foram iniciados.*

*Em outra janela do terminal, na mesma pasta do projeto*

    $ docker-compose down

#### Re-build:

    $ docker-compose build

*ou*

    $ docker-compose up --build

## Opção ao Docker

Para que seja possível executar o server sem a necessidade de usar o docker, mude a variável de ambiente **USE_DOCKER** que se encontra no arquivo **.env**.

 *padrão*:
  
    USE_DOCKER=true

 Mude esse valor pra ** *false* **, e use o comando usual para iniciar o server:

    $ yarn serve
 

##Acesso a API

Independente da utilização do Docker ou da execução normal do server, a API está disponivel no endereço [http://localhost:3000](http://localhost:3000)
