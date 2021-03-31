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
  fordFulkerson(m);
};

const fordFulkerson = (iArr) => {
  let arr = iArr.map(function (arr1) {
    return arr1.slice();
  });

  let maxFlow = [];
  let paths = [];
  let limit = 0;
  while (pathFinder(arr) && limit < 25) {
    limit++;

    let path = pathFinder(arr);
    console.log(path);

    let minEdge = {
      coordinates: [],
      value: Infinity,
      i: 0,
    };

    for (let i = 0; i < path.length; i++) {
      if (arr[path[i][0]][path[i][1]] < minEdge.value) {
        minEdge.coordinates = [path[i][0], path[i][1]];
        minEdge.value = arr[path[i][0]][path[i][1]];
        minEdge.i = i;
      }
    }

    console.log(minEdge);

    for (let i = 0; i < path.length; i++) {
      if (i == minEdge.i) arr[path[i][0]][path[i][1]] = 0;
      else arr[path[i][0]][path[i][1]] -= minEdge.value;
    }

    maxFlow.push(minEdge.value);
    paths.push(path);
  }

  console.log(...maxFlow);
  console.log(paths);
};

const pathFinder = (a) => {
  let path = [];
  let edgeList = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] != 0) edgeList.push({ coordinates: [i, j], value: a[i][j] });
    }
  }
  console.log(edgeList);

  if (edgeList.findIndex((val) => val.coordinates[0] == 0) == -1) return 0;
  path.push(
    edgeList[edgeList.findIndex((val) => val.coordinates[0] == 0)].coordinates
  );

  while (
    edgeList.findIndex(
      (val) => val.coordinates[0] == path[path.length - 1][1]
    ) != -1
  ) {
    console.log(
      `Found next: ${
        edgeList[
          edgeList.findIndex(
            (val) => val.coordinates[0] == path[path.length - 1][1]
          )
        ].coordinates
      }`
    );
    path.push(
      edgeList[
        edgeList.findIndex(
          (val) => val.coordinates[0] == path[path.length - 1][1]
        )
      ].coordinates
    );
    edgeList.splice(
      edgeList.findIndex((val) => val.coordinates == path[path.length - 1]),
      1
    );
    console.log("SPLICED");
    console.log(`New edgeList: \n`);
    console.log(edgeList);
    if (
      edgeList.findIndex(
        (val) => val.coordinates[0] == path[path.length - 1][1]
      ) == -1 &&
      path[path.length - 1][1] != a.length - 1
    ) {
      path.splice(path.length - 1);
    }
  }

  if (path[path.length - 1][1] == a.length - 1) return path;
  else {
    console.log(path);
    console.log("Not a path");
    a[path[path.length - 1][0]][path[path.length - 1][1]] = 0;
    return pathFinder(a);
  }
};

const printMatrix = (a) => {
  let output = "";
  for (let i = 0; i < a.length; i++) {
    output += "[";
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] < 10) output += `${a[i][j]}  `;
      else if (a[i][j] < 100) output += `${a[i][j]} `;
      else output += `${a[i][j]}`;
    }
    output += "]\n";
  }
  return output;
};
