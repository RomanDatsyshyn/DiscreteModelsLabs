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
  postman(m);
};

const eulerianPath = (a, b = []) => {
  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) sum += a[i][j];
  }

  sum /= 2;

  for (let i = 0; i < b.length; i++) sum += a[b[i][0]][b[i][1]];

  let stack1 = [0];
  let stack2 = [0];

  let edgeCount = 2;
  let limit = 0;

  while (edgeCount > 1 && limit < 25) {
    limit++;

    let next = "O";

    for (let i = 0; i < a[stack1[stack1.length - 1]].length; i++) {
      if (a[stack1[stack1.length - 1]][i] != 0 && next == "O") next = i;
    }

    console.log("STACK1 = " + stack1);
    console.log("STACK2 = " + stack2);

    if (next == stack2[stack2.length - 1]) {
      stack2.push(stack1[stack1.length - 1]);

      let newB = [];
      let del = 0;

      for (let i = 0; i < b.length; i++) {
        if (
          !(
            b[i][0] == stack1[stack1.length - 2] &&
            b[i][1] == stack1[stack1.length - 1]
          ) &&
          !(
            b[i][0] == stack1[stack1.length - 1] &&
            b[i][1] == stack1[stack1.length - 2]
          )
        )
          newB.push(b[i]);
        else {
          del++;
        }
      }

      b = [...newB];

      if (del == 0) {
        a[stack1[stack1.length - 1]][next] = 0;
        a[next][stack1[stack1.length - 1]] = 0;
      }
    } else {
      stack1.push(next);

      console.log(
        stack1[stack1.length - 1] + " : " + stack1[stack1.length - 2]
      );

      let newB = [];
      let del = 0;

      for (let i = 0; i < b.length; i++) {
        if (
          !(
            b[i][0] == stack1[stack1.length - 2] &&
            b[i][1] == stack1[stack1.length - 1]
          ) &&
          !(
            b[i][0] == stack1[stack1.length - 1] &&
            b[i][1] == stack1[stack1.length - 2]
          )
        )
          newB.push(b[i]);
        else {
          del++;
        }
      }

      b = [...newB];

      if (del == 0) {
        a[stack1[stack1.length - 1]][stack1[stack1.length - 2]] = 0;
        a[stack1[stack1.length - 2]][stack1[stack1.length - 1]] = 0;
      }
    }

    edgeCount = 0;

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].length; j++) if (a[i][j] != 0) edgeCount++;
    }

    edgeCount /= 2;
    edgeCount += b.length;
    console.log(edgeCount);
  }

  console.log(stack1);
  console.log(stack2);

  let result = [...stack2];

  for (let i = stack1.length - 1; i >= 0; i--) result.push(stack1[i]);

  console.log(result);
  console.log(sum);
};

const postman = (arr) => {
  let edgeCount = [];

  for (let i = 0; i < arr.length; i++) {
    edgeCount.push(0);

    for (let j = 0; j < arr[i].length; j++) if (arr[i][j] != 0) edgeCount[i]++;
  }

  console.log(edgeCount);

  let oddCount = 0;

  for (let i = 0; i < edgeCount.length; i++) {
    if (edgeCount[i] % 2 != 0) oddCount++;
  }

  if (oddCount > 2) {
    console.log("Non-Eulerian graph");
    console.log("Duplicating edges");

    let oddIndexes = [];

    for (let i = 0; i < edgeCount.length; i++) {
      if (edgeCount[i] % 2 != 0) oddIndexes.push(i);
    }

    console.log(oddIndexes);

    let duplicatePairs = [];

    while (oddIndexes.length > 1) {
      let first = oddIndexes[0];
      let second;

      for (let i = 1; i < oddIndexes.length; i++) {
        if (arr[first][oddIndexes[i]] != 0 && !second) second = oddIndexes[i];
      }

      if (!second) {
        console.log("No Eulerian Cycle and can`t duplicate odd edges");

        return 0;
      } else {
        console.log(second);

        oddIndexes.splice(oddIndexes.indexOf(first), 1);
        oddIndexes.splice(oddIndexes.indexOf(second), 1);

        console.log(oddIndexes);

        duplicatePairs.push([first, second]);
      }
    }

    console.log(duplicatePairs);

    eulerianPath(arr, duplicatePairs);
  } else {
    console.log("Eulerian graph");
    eulerianPath(arr);
  }
};
