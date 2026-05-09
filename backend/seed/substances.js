module.exports = [
  {
    name: 'Парацетамол',

    area: {
      type: 'linear',
      a: -12590,
      b: 12847,
      r2: 0.9933,
    },

    perimeter: {
      type: 'linear',
      a: -377.5,
      b: 580.1,
      r2: 0.9481,
    },
  },

  {
    name: 'Инсулин',

    area: {
      type: 'linear',
      a: -1976.5,
      b: 7580.7,
      r2: 0.9771,
    },

    perimeter: {
      type: 'linear',
      a: -90.033,
      b: 492.49,
      r2: 0.9869,
    },
  },

  {
    name: 'Глицин',

    area: {
      type: 'power',
      a: 11999,
      b: 0.3281,
      r2: 0.9877,
    },

    perimeter: {
      type: 'power',
      a: 425.92,
      b: -0.147,
      r2: 0.9847,
    },
  },

  {
    name: 'Резорцин',

    area: {
      type: 'polynomial2',
      a: -204890,
      b: 92330,
      c: 26197,
      r2: 0.9999,
    },

    perimeter: {
      type: 'polynomial2',
      a: -2716.2,
      b: 1356.7,
      c: 654.09,
      r2: 0.9999,
    },
  },

  {
    name: 'Инфезол',

    area: {
      type: 'exponential',
      a: 53393,
      b: -1.294,
      r2: 0.9985,
    },

    perimeter: {
      type: 'exponential',
      a: 885.11,
      b: -0.558,
      r2: 0.9973,
    },
  },
]
