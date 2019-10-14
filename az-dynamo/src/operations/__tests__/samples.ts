export const calcInfoDF = {
  category: 'calcInfo',
  brState: 'DF',
  availableMonthlyEnergy: 150,
  bandeira6meses: 0.032,
  descontoEpopPct: 8.33,
  epopEnergyCoef: 0.9,
  icmsPct: 21,
  iluminacaoPublica: 45,
  limits: {
    monophasic: {
      max: 100000,
      minEpop: 80,
      minProvider: 30,
    },
    biphasic: {
      max: 100000,
      minEpop: 100,
      minProvider: 50,
    },
    triphasic: {
      max: 100000,
      minEpop: 150,
      minProvider: 100,
    },
  },
  nominalPotency: 14,
  notax: false,
  specificProduction: 1555.2,
  tarifa: 0.763,
};

export const calcInfoGO = {
  category: 'calcInfo',
  brState: 'GO',
  availableMonthlyEnergy: 150,
  bandeira6meses: 0.032,
  descontoEpopPct: 8.33,
  epopEnergyCoef: 0.9,
  icmsPct: 29,
  iluminacaoPublica: 15,
  limits: {
    monophasic: {
      max: 100000,
      minEpop: 80,
      minProvider: 30,
    },
    biphasic: {
      max: 100000,
      minEpop: 100,
      minProvider: 50,
    },
    triphasic: {
      max: 100000,
      minEpop: 150,
      minProvider: 100,
    },
  },
  nominalPotency: 14,
  notax: false,
  specificProduction: 1555.2,
  tarifa: 0.879,
};
