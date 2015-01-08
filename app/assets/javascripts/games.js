(function() {
  function isNum(val) {
    return val > 0 && val < 10;
  }

  function choices(val) {
    if (val > 0) {
      return [val];
    } else {
      return [1,2,3,4,5,6,7,8,9];
    }
  }

  function asGrid(cells) {
    var board = [];
    var n = 0;
    var i, j;
    for (i = 0; i < 9; i++) {
      var row = [];
      for (j = 0; j < 9; j++) {
        row.push(cells[n++]);
      }
      board.push(row);
    }

    return board;
  }


  function mergePlays(vals, plays) {
    var board = [];
    var i;

    for (i = 0; i < 81; i++) {
      board.push(parseInt(vals[i] || plays[i] || 0));
    }
    return board;
  }

  function rows(cells) {
    return cells;
  }

  function cols(cells) {
    var cols = [];
    var i, j;
    for (i = 0; i < 9; i++) {
      var col = [];
      for (j = 0; j < 9; j++) {
        col.push(cells[j][i]);
      }
      cols.push(col);
    }

    return cols;
  }

  function boxs(cells) {
    var boxs = [];
    var b, j, k;
    for (b = 0; b < 9; b++) {
      var box = [];
      var bj = 3 * Math.floor(b/3);
      var bk = 3 * (b%3);
      for (j = 0; j < 3; j++) {
        for (k = 0; k < 3; k++) {
          box.push(cells[bj+j][bk+k]);
        }
      }
      boxs.push(box);
    }
    return boxs;
  }

  function reduce(row) {
    var singles = {}
    var i;
    for (i = 0; i < row.length; i++) {
      if (row[i].length == 1) {
        singles[row[i][0]] = 1;
      }
    }
    // dumpRow(row);
    return row.map(function(choices) {
      if (choices.length == 1)
        return choices;
      var i;
      var newChoices = [];
      for (i = 0; i < choices.length; i++) {
        if (!singles[choices[i]]) {
          newChoices.push(choices[i]);
        }
      }
      return newChoices;
    });
  }

  function prune(cells, fn) {
    var tcells = fn(cells);
    var tpcells = tcells.map(reduce);
    return fn(tpcells);
  }

  function findHints(cells, fn, prefix, hints) {
    fn(cells).forEach(function(row, n) {
      var k;
      for (k = 1; k <= 9; k++) {
        var places = row.filter(function(choices) {
          return choices && choices.includes(k);
        });

        if (places.length == 1) {
          hints.push([prefix + (n+1), k]);
        }
      }
    });
  }

  function hint(vals, plays) {
    var merged = mergePlays(vals, plays);
    var cells = asGrid(merged.map(choices));

    cells = prune(cells, rows);
    // console.log(longstr(cells));
    cells = prune(cells, cols);
    // console.log(longstr(cells));
    cells = prune(cells, boxs);
    // console.log(longstr(cells));

    var i, j;
    for (i = 0; i < 9; i++) {
      for (j = 0; j < 9; j++) {
        if (merged[9*i+j])
          cells[i][j] = null;
      }
    }

    var hints = []
    findHints(cells, rows, "r", hints);
    findHints(cells, cols, "c", hints);
    findHints(cells, boxs, "b", hints);

    // console.log(hints.map(function(a) { return a.join("="); }));
    var numUsed = merged.filter(function(val) { return val > 0; }).length;

    return hints[(numUsed * 2677) % hints.length];
  }

  function longstr(cells) {
    s = "";
    for (i=0; i < 9; i++) {
      for (j = 0; j < 9; j++) {
        for (k = 0; k < cells[i][j].length; k++) {
          s += cells[i][j][k];
        }
        s += ",";
      }
      s += "\n";
    }
    return s;
  }

  function dumpRow(rowOfChoices) {
    console.log("dumprow ",
      rowOfChoices.map(function(choices) {
        return choices.join("");
      }).join(", ")
    );
  }

  function test() {
    var cells = [];
    var i;
    for (i = 0; i < 81; i++) {
      cells.push(i);
    }
    var grid = asGrid(cells);
    printGrid(grid);
    grid = boxs(grid);
    printGrid(grid);
  }

  function printGrid(grid) {
    var i;
    for (i = 0; i < 9; i++) {
      console.log(grid[i].join(" "));
    }
  }
  // test();

  window.Pseudoku = {
    hint: hint
  };
})();
