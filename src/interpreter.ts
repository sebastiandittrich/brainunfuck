var operations = {
  whilestart: "[",
  whileend: "]",
  pointerright: ">",
  pointerleft: "<",
  valueup: "+",
  valuedown: "-",
  print: ".",
  read: ",",
};

export const interpret = (code: string, input: number[]) => {
  var pointer = 0;
  var dataline: number[] = [];
  var content = code;

  function getStartingIndex(endindex: number) {
    var currentindex = endindex - 1;
    var depth = 0;
    while (true) {
      if (content[currentindex] == operations.whilestart) {
        if (depth < 1) {
          return currentindex;
        } else {
          depth = depth - 1;
        }
      }
      if (content[currentindex] == operations.whileend) {
        depth++;
      }
      currentindex = currentindex - 1;
    }
  }

  function getEndingIndex(startindex: number) {
    var currentindex = startindex + 1;
    var depth = 0;
    while (true) {
      if (content[currentindex] == operations.whileend) {
        if (depth < 1) {
          return currentindex;
        } else {
          depth = depth - 1;
        }
      }
      if (content[currentindex] == operations.whilestart) {
        depth++;
      }
      currentindex = currentindex + 1;
    }
  }

  let charindex = 0;

  while (charindex < content.length) {
    // console.log(charindex)
    var char = content[charindex];
    if (char == operations.pointerright) {
      pointer++;
      charindex++;
    } else if (char == operations.pointerleft) {
      pointer = pointer - 1;
      charindex++;
    } else if (char == operations.valueup) {
      dataline[pointer] = dataline[pointer] ? dataline[pointer] + 1 : 1;
      charindex++;
    } else if (char == operations.valuedown) {
      dataline[pointer] = dataline[pointer] ? dataline[pointer] - 1 : -1;
      charindex++;
    } else if (char == operations.print) {
      process.stdout.write(String.fromCharCode(dataline[pointer] || 0));
      charindex++;
    } else if (char == operations.read) {
      if (input.length < 1) throw new Error("Not enough input");
      dataline[pointer] = input[0];
      input = input.slice(1);
      charindex++;
    } else if (char == operations.whilestart) {
      if (dataline[pointer] == 0 || dataline[pointer] == undefined) {
        charindex = getEndingIndex(charindex) + 1;
      } else {
        charindex++;
      }
    } else if (char == operations.whileend) {
      charindex = getStartingIndex(charindex);
    } else {
      // Is a comment
      charindex++;
    }
  }
};
