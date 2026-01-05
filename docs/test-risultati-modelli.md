# Risultati Test Comparativo Modelli OpenAI

**Data Test:** 5 Gennaio 2026
**Query di Test:** Analisi pro/contro microservizi vs architettura monolitica per startup e-commerce

---

## Configurazione Test

- **Modelli testati:** gpt-5-nano, gpt-5-mini, gpt-5
- **Livelli di ragionamento:** low, medium, high
- **Combinazioni totali:** 9
- **Durata totale:** 7.61 minuti

---

## Risultati Dettagliati

| Modello | Ragionamento | Durata | Parole | Caratteri | Token Output |
|---------|--------------|--------|--------|-----------|--------------|
| gpt-5-nano | low | 22.94s | 1103 | 8143 | 2197 |
| gpt-5-nano | medium | 27.24s | 841 | 5972 | 3038 |
| gpt-5-nano | high | 52.98s | 1054 | 7610 | 6761 |
| gpt-5-mini | low | 25.83s | 940 | 6966 | 1902 |
| gpt-5-mini | medium | 60.97s | 852 | 6005 | 2684 |
| gpt-5-mini | high | 84.45s | 858 | 6383 | 6074 |
| gpt-5 | low | 37.79s | 633 | 4537 | 1500 |
| gpt-5 | medium | 57.31s | 511 | 3744 | 2323 |
| gpt-5 | high | 78.22s | 570 | 4216 | 3282 |

---

## Analisi per Modello

### gpt-5-nano
- **Durata media:** 34.39s
- **Parole medie:** 999
- **Caratteristiche:** Più veloce, risposte più verbose

### gpt-5-mini
- **Durata media:** 57.08s
- **Parole medie:** 883
- **Caratteristiche:** Buon equilibrio qualità/velocità

### gpt-5
- **Durata media:** 57.77s
- **Parole medie:** 571
- **Caratteristiche:** Risposte più concise e focalizzate

---

## Analisi per Livello di Ragionamento

| Livello | Durata Media | Parole Medie |
|---------|--------------|--------------|
| Low | 28.85s | 892 |
| Medium | 48.51s | 735 |
| High | 71.88s | 827 |

**Osservazione:** Maggiore sforzo di ragionamento = 2-3x più lento, ma non necessariamente più parole.

---

## Punti Salienti

- **Risposta più veloce:** gpt-5-nano + low (22.94s)
- **Risposta più lenta:** gpt-5-mini + high (84.45s)
- **Più verboso:** gpt-5-nano + low (1103 parole)
- **Più conciso:** gpt-5-mini + medium (511 parole)

---

## Configurazione Consigliata per l'App

| Livello | Modello | Ragionamento | Durata Attesa | Caratteristiche |
|---------|---------|--------------|---------------|-----------------|
| **Base** | gpt-5-nano | medium | ~27s | Veloce, bilanciato |
| **Medio** | gpt-5-mini | medium | ~61s | Miglior ragionamento |
| **Avanzato** | gpt-5 | high | ~78s | Massima qualità |

---

## Note Tecniche

- La **verbosità** è controllata dal prompt nel dashboard OpenAI, non via API
- Il **ragionamento** può essere sovrascritto via API con il parametro `reasoning.effort`
- I token di ragionamento non sono esposti separatamente nella risposta API
