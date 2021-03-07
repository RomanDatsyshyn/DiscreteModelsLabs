// const m1 = [
//   [0, 3, 0, 0, 0, 34, 0, 80],
//   [3, 0, 0, 1, 0, 0, 0, 68],
//   [0, 0, 0, 0, 23, 0, 12, 0],
//   [0, 1, 0, 0, 53, 0, 0, 39],
//   [0, 0, 23, 53, 0, 0, 68, 14],
//   [34, 0, 0, 0, 0, 0, 0, 25],
//   [0, 0, 12, 0, 68, 0, 0, 99],
//   [80, 68, 0, 39, 14, 25, 99, 0],
// ];

// const m2 = [
//   [0, 0, 38, 95, 0, 1, 57, 0],
//   [0, 0, 0, 0, 79, 0, 36, 19],
//   [38, 0, 0, 51, 0, 0, 44, 0],
//   [95, 0, 51, 0, 0, 44, 0, 0],
//   [0, 79, 0, 0, 0, 93, 41, 48],
//   [1, 0, 0, 44, 93, 0, 1, 0],
//   [57, 36, 44, 0, 41, 1, 0, 0],
//   [0, 19, 0, 0, 48, 0, 0, 0],
// ];

// const m3 = [
//   [0, 0, 7, 0, 0, 0, 46, 98],
//   [0, 0, 33, 0, 0, 99, 0, 0],
//   [7, 33, 0, 99, 92, 28, 0, 64],
//   [0, 0, 99, 0, 15, 52, 0, 0],
//   [0, 0, 92, 15, 0, 0, 0, 58],
//   [0, 99, 28, 52, 0, 0, 0, 0],
//   [46, 0, 0, 0, 0, 0, 0, 36],
//   [98, 0, 64, 0, 58, 0, 36, 0],
// ];

let matrixLength;

let initialString = "";

let html = "";

let m1 = [];

const MAX_INTEGER = Number.MAX_SAFE_INTEGER;
const MIN_INTEGER = Number.MIN_SAFE_INTEGER;

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

const minValue = (key, mstSet) => {
  let min = MAX_INTEGER;
  let minIndex = MIN_INTEGER;

  for (let i = 0; i < matrixLength; i++) {
    if (mstSet[i] === false && key[i] < min) {
      min = key[i];
      minIndex = i;
    }
  }

  return minIndex;
};

const printMST = (parent, graph) => {
  html += `<br/>Edge &#8195;Weight  <br/>`;
  console.log("Edge \tWeight");

  for (let i = 1; i < matrixLength; i++) {
    html += `${parent[i]}  -  ${i} &#8195;  ${graph[i][parent[i]]} <br/>`;
    console.log(parent[i] + " - " + i + "\t" + graph[i][parent[i]]);
  }
};

const primMST = (graph) => {
  let parent = [];
  let key = [];
  let mstSet = [];

  for (let i = 0; i < matrixLength; i++) {
    key[i] = MAX_INTEGER;
    mstSet[i] = false;
  }

  key[0] = 0;
  parent[0] = -1;

  for (let i = 0; i < matrixLength - 1; i++) {
    let u = minValue(key, mstSet);
    mstSet[u] = true;

    for (let j = 0; j < matrixLength; j++) {
      if (graph[u][j] !== 0 && mstSet[j] === false && graph[u][j] < key[j]) {
        parent[j] = u;
        key[j] = graph[u][j];
      }
    }
  }

  printMST(parent, graph);
  document.getElementById("container").innerHTML = html;
};

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

  m1 = m;
  primMST(m1);
};
