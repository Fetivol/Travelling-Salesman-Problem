const inputData = `
16 Warszawa
Białystok Olsztyn 210
Białystok Warszawa 132
Białystok Lublin 226
Białystok Bydgoszcz 306
Białystok Gdańsk 289
Białystok Łódź 209
Białystok Poznań 306
Białystok Szczecin 448
Białystok Gorzów-Wielkopolski 391
Białystok Wrocław 333
Białystok Opole 343
Białystok Katowice 309
Białystok Kielce 247
Białystok Kraków 327
Białystok Rzeszów 320
Olsztyn Warszawa 161
Olsztyn Lublin 263
Olsztyn Bydgoszcz 187
Olsztyn Gdańsk 114
Olsztyn Łódź 211
Olsztyn Poznań 268
Olsztyn Szczecin 367
Olsztyn Gorzów-Wielkopolski 353
Olsztyn Wrocław 335
Olsztyn Opole 350
Olsztyn Katowice 316
Olsztyn Kielce 273
Olsztyn Kraków 353
Olsztyn Rzeszów 355
Warszawa Lublin 118
Warszawa Bydgoszcz 200
Warszawa Gdańsk 229
Warszawa Łódź 104
Warszawa Poznań 198
Warszawa Szczecin 340
Warszawa Gorzów-Wielkopolski 283
Warszawa Wrocław 225
Warszawa Opole 228
Warszawa Katowice 193
Warszawa Kielce 128
Warszawa Kraków 209
Warszawa Rzeszów 207
Lublin Bydgoszcz 286
Lublin Gdańsk 341
Lublin Łódź 189
Lublin Poznań 287
Lublin Szczecin 429
Lublin Gorzów-Wielkopolski 372
Lublin Wrocław 314
Lublin Opole 319
Lublin Katowice 248
Lublin Kielce 148
Lublin Kraków 211
Lublin Rzeszów 114
Bydgoszcz Gdańsk 116
Bydgoszcz Łódź 155
Bydgoszcz Poznań 97
Bydgoszcz Szczecin 219
Bydgoszcz Gorzów-Wielkopolski 183
Bydgoszcz Wrocław 197
Bydgoszcz Opole 254
Bydgoszcz Katowice 258
Bydgoszcz Kielce 262
Bydgoszcz Kraków 312
Bydgoszcz Rzeszów 380
Gdańsk Łódź 206
Gdańsk Poznań 197
Gdańsk Szczecin 262
Gdańsk Gorzów-Wielkopolski 281
Gdańsk Wrocław 295
Gdańsk Opole 345
Gdańsk Katowice 311
Gdańsk Kielce 314
Gdańsk Kraków 365
Gdańsk Rzeszów 422
Łódź Poznań 143
Łódź Szczecin 282
Łódź Gorzów-Wielkopolski 226
Łódź Wrocław 145
Łódź Opole 167
Łódź Katowice 137
Łódź Kielce 139
Łódź Kraków 193
Łódź Rzeszów 274
Poznań Szczecin 168
Poznań Gorzów-Wielkopolski 109
Poznań Wrocław 127
Poznań Opole 182
Poznań Katowice 232
Poznań Kielce 260
Poznań Kraków 286
Poznań Rzeszów 368
Szczecin Gorzów-Wielkopolski 73
Szczecin Wrocław 247
Szczecin Opole 289
Szczecin Katowice 337
Szczecin Kielce 402
Szczecin Kraków 391
Szczecin Rzeszów 473
Gorzów-Wielkopolski Wrocław 187
Gorzów-Wielkopolski Opole 229
Gorzów-Wielkopolski Katowice 278
Gorzów-Wielkopolski Kielce 342
Gorzów-Wielkopolski Kraków 332
Gorzów-Wielkopolski Rzeszów 414
Wrocław Opole 81
Wrocław Katowice 129
Wrocław Kielce 252
Wrocław Kraków 183
Wrocław Rzeszów 265
Opole Katowice 83
Opole Kielce 210
Opole Kraków 138
Opole Rzeszów 220
Katowice Kielce 132
Katowice Kraków 67
Katowice Rzeszów 148
Kielce Kraków 100
Kielce Rzeszów 145
Kraków Rzeszów 112
`;

function parseInputData(input) {
  const lines = input.trim().split("\n");

  const [numCitiesString, startCity] = lines[0].split(" ");
  const numCities = parseInt(numCitiesString, 10);

  const cityData = lines.slice(1).map((line) => {
    const [cityA, cityB, time] = line.split(" ");
    return {
      cityA,
      cityB,
      time: parseInt(time, 10),
    };
  });

  return {
    numCities,
    startCity,
    cityData,
  };
}

function geneticAlgorithmTSP(startCity, cityData, populationSize, generations) {
  const distances = {};

  cityData.forEach(({ cityA, cityB, time }) => {
    distances[cityA] = distances[cityA] || {};
    distances[cityB] = distances[cityB] || {};
    distances[cityA][cityB] = time;
    distances[cityB][cityA] = time;
  });

  let population = [];
  for (let i = 0; i < populationSize; i++) {
    let path = Object.keys(distances);
    path = path.filter((city) => city !== startCity);
    path = [startCity, ...path.sort(() => 0.5 - Math.random())];
    population.push(path);
  }

  for (let generation = 0; generation < generations; generation++) {
    population = population.map((path) => {
      return {
        path,
        fitness: calculateTotalDistance(path, distances),
      };
    });

    population.sort((a, b) => a.fitness - b.fitness);

    const newPopulation = [population[0].path];

    while (newPopulation.length < populationSize) {
      const parent1 =
        population[Math.floor(Math.random() * populationSize)].path;
      const parent2 =
        population[Math.floor(Math.random() * populationSize)].path;
      const crossoverPoint =
        Math.floor(Math.random() * (parent1.length - 1)) + 1;
      let child = [...parent1.slice(0, crossoverPoint)];
      for (const city of parent2) {
        if (!child.includes(city)) {
          child.push(city);
        }
      }
      newPopulation.push(child);
    }
    population = newPopulation;
  }

  const bestPath = population[0];
  console.log("best path", bestPath);
  const totalTime = calculateTotalDistance(bestPath, distances);

  return { bestPath, totalTime };
}

function calculateTotalDistance(path, distances) {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const currentCity = path[i];
    const nextCity = path[i + 1];
    totalDistance += distances[currentCity][nextCity];
  }
  totalDistance += distances[path[path.length - 1]][path[0]];
  return totalDistance;
}

const { numCities, startCity, cityData } = parseInputData(inputData);

const populationSize = 10;
const generations = 1000;
const { bestPath, totalTime } = geneticAlgorithmTSP(
  startCity,
  cityData,
  populationSize,
  generations
);

console.log("Best TSP Path:", bestPath);
console.log("Total Travel Distance:", totalTime, "minutes");
