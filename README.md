
# Operational Analytics Project

Projeto demonstrando um pipeline simples de Engenharia de Dados + Analytics.

## Arquitetura

Kaggle Dataset → Python ETL → Data Lake (Parquet) → SQL Metrics → Power BI Dashboard

## Tecnologias

- Python
- Pandas
- SQL
- Parquet
- Power BI

## Estrutura

data/
    raw/
    processed/

etl/
    etl_pipeline.py

sql/
    metrics.sql

dashboard/
    powerbi_dashboard_template.txt

docs/
    architecture.md

## Fonte de Dados (Kaggle)

Dataset sugerido:
https://www.kaggle.com/datasets/tobiasbueck/multilingual-customer-support-tickets

Baixe o CSV e coloque em:

data/raw/tickets.csv

## Executar Pipeline

pip install pandas pyarrow

python etl/etl_pipeline.py

Isso irá gerar:

data/processed/tickets_clean.parquet

Depois importe no Power BI.
