let initialString = "";
let matrixLength;
let html = "";
let m1 = [];

let input = document.querySelector("input");

input.addEventListener("change", () => {
  let files = input.files;

  if (files.length == 0) return;

  const file = files[0];

  let reader = new FileReader();

  reader.onload = (e) => {
    let file = e.target.result;
    file = file.replace(/(\r\n|\n|\r)/gm, " ");

    initialString = file;
    parseMatrix(initialString);
  };

  reader.onerror = (e) => alert(e.target.error.name);

  reader.readAsText(file);
});

const parseMatrix = (matrix) => {
  matrixLength = matrix[0];
  let str = matrix.substring(2);

  let arr = [];
  let num = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] !== " ") {
      num += str[i];
    } else {
      arr.push(parseInt(num));
      num = "";
    }
  }

  let m = [];
  for (let i = 0; i < matrixLength; i++) {
    m[i] = new Array(matrixLength);
  }

  let j = 0;
  let k = 0;

  for (let i = 0; i < arr.length; i++) {
    if (j < Math.sqrt(arr.length)) {
      m[k][j] = arr[i];
      j++;
    } else {
      j = 0;
      k++;
      m[k][j] = arr[i];
      j++;
    }
  }

  html += `<br/><h1>Open a terminal</h1><br/>`;
  document.getElementById("container").innerHTML = html;
  commisVoyageur(graphFiller(m));
};

function commisVoyageur(arr) {
  console.log(arr);

  let arrCopy = arr.map(function (arr1) {
    return arr1.slice();
  });

  arr = minColRowDel(arr)[0];
  let minRow = minColRowDel(arr)[1];
  let minCol = minColRowDel(arr)[2];
  console.log(arr);

  let minLim =
    minRow.reduce((a, b) => a + b, 0) + minCol.reduce((a, b) => a + b, 0);
  console.log(`minLim: ${minLim}`);

  let limit = 0;
  let banList = [];
  let result = `Path: `;

  while (limit < 20 && banList.length < arr.length * 2) {
    limit++;

    let maxZeroMatrix = maxZeroMatrixCount(arr);
    console.log(maxZeroMatrix);
    let maxZero = {
      value: 0,
      position: [0, 0],
    };
    for (let i = 0; i < maxZeroMatrix.length; i++) {
      for (let j = 0; j < maxZeroMatrix[0].length; j++) {
        if (maxZeroMatrix[i][j] > maxZero.value) {
          maxZero.value = maxZeroMatrix[i][j];
          maxZero.position = [i, j];
        }
      }
    }
    console.log(maxZero);

    includeResult = include(arr, maxZero.position, banList);
    console.log(includeResult);
    notIncludeResult = notInclude(arr, maxZero.position);
    console.log(notIncludeResult);

    if (includeResult.minLim < notIncludeResult.minLim) {
      console.log(`\n\nIncluding (${maxZero.position})\n\n`);

      arr = includeResult.matrix;
      banList.push(maxZero.position[0], maxZero.position[1]);
    } else {
      console.log(`\n\nNot including (${maxZero.position})\n\n`);
      arr = notIncludeResult.matrix;
    }

    console.log("BanList:" + banList);

    tempResult = "Edges list: ";
    for (let i = 0; i < banList.length - 1; i += 2) {
      tempResult += `(${banList[i]},${banList[i + 1]})`;
      if (i != banList.length - 2) tempResult += ` => `;
    }
  }

  for (let i = 0; i < banList.length - 1; i += 2) {
    const element = banList[i];
    result += `(${banList[i]}, ${banList[i + 1]}) => `;
  }

  console.log(result);

  let sum = 0;

  for (let i = 0; i < arrCopy.length; i++) {
    for (let j = 0; j < arrCopy[i].length; j++) {
      for (let k = 0; k < banList.length - 1; k += 2) {
        if (i == banList[k] && j == banList[k + 1]) sum += arrCopy[i][j];
      }
    }
  }

  console.log("SUM: " + sum);

  let resultCycle = cycleBuilder(banList);
  console.log(resultCycle);

  function minColRowDel(arr) {
    let tempArr = arr.map(function (arr) {
      return arr.slice();
    });

    let minRow = [];
    let minCol = [];

    for (let i = 0; i < tempArr.length; i++) {
      minRow.push(Infinity);
      for (let j = 0; j < tempArr[i].length; j++) {
        if (tempArr[i][j] < minRow[i]) minRow[i] = tempArr[i][j];
      }
    }

    console.log(`minRow: ${minRow}`);

    for (let i = 0; i < tempArr.length; i++) {
      for (let j = 0; j < tempArr[i].length; j++) {
        tempArr[i][j] -= minRow[i];
      }
    }

    console.log(tempArr);

    for (let i = 0; i < tempArr.length; i++) {
      minCol.push(Infinity);
      for (let j = 0; j < tempArr[i].length; j++) {
        if (tempArr[j][i] < minCol[i]) minCol[i] = tempArr[j][i];
      }
    }

    console.log(`minCol: ${minCol}`);

    for (let i = 0; i < tempArr.length; i++) {
      for (let j = 0; j < tempArr[i].length; j++) {
        tempArr[j][i] -= minCol[i];
      }
    }

    return [tempArr, minRow, minCol];
  }

  function maxZeroMatrixCount(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push([]);
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] == 0) {
          let tempArr = arr.map(function (arr) {
            return arr.slice();
          });
          tempArr[i][j] = Infinity;
          let minRow = Infinity;
          for (let k = 0; k < tempArr.length; k++) {
            if (tempArr[i][k] < minRow) minRow = tempArr[i][k];
          }

          let minCol = Infinity;
          for (let k = 0; k < tempArr.length; k++) {
            if (tempArr[k][j] < minCol) minCol = tempArr[k][j];
          }
          result[i].push(minRow + minCol);
          console.log(
            `O(${i};${j}) = ${minRow} + ${minCol} = ${minRow + minCol}`
          );
        } else result[i].push(0);
      }
    }
    return result;
  }

  function notInclude(inputArr, position) {
    let tempArr = inputArr.map(function (arr) {
      return arr.slice();
    });
    tempArr[position[0]][position[1]] = Infinity;

    console.log("SENDING THIS TO NOT include minColRowDel:");
    console.log(tempArr);

    let exportArr = minColRowDel(tempArr)[0];
    let minRow = minColRowDel(tempArr)[1];
    let minCol = minColRowDel(tempArr)[2];

    minRow.forEach(function (item, i) {
      if (item == Infinity) minRow[i] = 0;
    });
    minCol.forEach(function (item, i) {
      if (item == Infinity) minCol[i] = 0;
    });

    let minLim =
      minRow.reduce((a, b) => a + b, 0) + minCol.reduce((a, b) => a + b, 0);
    return { matrix: exportArr, minLim: minLim };
  }

  function include(inputArr, position, banList) {
    let tempArr = inputArr.map(function (arr) {
      return arr.slice();
    });
    tempArr[position[1]][position[0]] = Infinity;

    for (let i = 0; i < banList.length - 1; i += 2) {
      if (banList[i] == position[0]) {
        tempArr[banList[i + 1]][position[1]] = Infinity;
        tempArr[position[1]][banList[i + 1]] = Infinity;
      }
      if (banList[i + 1] == position[0]) {
        tempArr[banList[i]][position[1]] = Infinity;
        tempArr[position[1]][banList[i]] = Infinity;
      }
      if (banList[i] == position[1]) {
        tempArr[banList[i + 1]][position[0]] = Infinity;
        tempArr[position[0]][banList[i + 1]] = Infinity;
      }
      if (banList[i + 1] == position[1]) {
        tempArr[banList[i]][position[0]] = Infinity;
        tempArr[position[0]][banList[i]] = Infinity;
      }
    }

    for (let i = 0; i < tempArr.length; i++) {
      for (let j = 0; j < tempArr[i].length; j++) {
        if (i == position[0] || j == position[1]) tempArr[i][j] = Infinity;
      }
    }

    console.log("SENDING THIS TO INCLUDE minColRowDel:");
    console.log(tempArr);

    let exportArr = minColRowDel(tempArr)[0];
    let minRow = minColRowDel(tempArr)[1];
    let minCol = minColRowDel(tempArr)[2];

    minRow.forEach(function (item, i) {
      if (item == Infinity) minRow[i] = 0;
    });
    minCol.forEach(function (item, i) {
      if (item == Infinity) minCol[i] = 0;
    });

    let minLim =
      minRow.reduce((a, b) => a + b, 0) + minCol.reduce((a, b) => a + b, 0);

    if (
      minRow.every((val, i, arr) => val === arr[0]) &&
      minCol.every((val, i, arr) => val === arr[0])
    )
      minLim--;

    return { matrix: exportArr, minLim: minLim };
  }

  function cycleBuilder(a) {
    let result = "Cycle: ";
    let resultArr = [a[0], a[1]];

    for (let i = 0; i < a.length / 2 - 1; i++) {
      if (findNext(a, resultArr[resultArr.length - 1]) != Infinity)
        resultArr.push(findNext(a, resultArr[resultArr.length - 1]));
      else return "Cycle not found";
    }

    function findNext(a, b) {
      for (let i = 0; i < a.length - 1; i += 2) {
        if (a[i] == b) {
          return a[i + 1];
        }
      }
      return Infinity;
    }

    for (let i = 0; i < resultArr.length; i++) {
      result += `(${resultArr[i]})`;
      if (i != resultArr.length - 1) result += " => ";
    }

    return result;
  }
}

function graphFiller(arr) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    if (Math.max(...arr[i]) > max) max = Math.max(...arr[i]);
  }

  console.log(max);
  max++;

  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push([]);
    for (let j = 0; j < arr[i].length; j++) {
      if (i == j) result[i].push(Infinity);
      else if (arr[i][j] == 0) result[i].push(max);
      else result[i].push(arr[i][j]);
    }
  }

  return result;
}

// const m1 = [
//   [0, 0, 69, 60, 10, 20],
//   [0, 0, 0, 31, 39, 2],
//   [69, 0, 0, 0, 59, 0],
//   [60, 31, 0, 0, 0, 36],
//   [10, 39, 59, 0, 0, 79],
//   [20, 2, 0, 36, 79, 0],
// ];
