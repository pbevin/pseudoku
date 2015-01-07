var game;
var update = React.addons.update;

React.initializeTouchEvents(true);

function fixVal(val) {
  val = val.replace(/[^1-9]/g, '');
  if (val > 9)
    val = val % 10;
  if (val == 0)
    val = '';
  return val;
}

function sendPlayEvent(pos, val) {
  game.play(pos, val);
}

function calculateHint(vals, plays) {
  return Pseudoku.hint(vals, plays);
}

function enableHint() {
  game.enableHint();
}

function disableHint() {
  game.disableHint();
}


function boxName(r, c) {
  r--;
  c--;
  var br = Math.floor(r / 3);
  var bc = Math.floor(c / 3);
  return "b" + (3*br + bc + 1);
}

function isHinted(hint, row, col, box, pos) {
  return hint[0] == row || hint[0] == col || hint[0] == box || hint[0] == pos;
}

function groupType(hint) {
  var g = hint[0];

  switch (g[0]) {
    case 'r':
      return "row";
    case 'c':
      return "column";
    case 'b':
      return "box";
  }
}

var Hint = React.createClass({
  render: function() {
    var text = "";
    var hint = this.props.hint;
    if (hint) {
      text = "HINT: Find " + hint[1] + " in the highlighted " + groupType(hint) + ".";
    } else {
      text = "Need a hint?"
    }
    return (
      <div id="hint" onMouseDown={this.startHint} onTouchStart={this.startHint}>{text}</div>
    );
  },
  startHint: function() {
    enableHint();
  },
  endHint: function() {
    disableHint();
  }
});

var ValueSelect = React.createClass({
  handleClick: function(event) {
    var value = $(event.target).data("value");
    if (value == "Clear") value = '';
    sendPlayEvent(this.props.selectedPos, value);
  },

  render: function() {
    if (this.props.selectedPos >= 0) {
      var buttons = [1,2,3,4,5,6,7,8,9,"Clear"].map(function(n) {
        return <button key={n} onClick={this.handleClick} data-value={n}>{n}</button>;
      }.bind(this));
      return <div className="value_select">{buttons}</div>;
    } else {
      return <div className="value_select"></div>;
    }
  }
});

var Game = React.createClass({
  getInitialState: function() {
    return { plays: [], hintEnabled: false, selectedPos: -1 };
  },

  play: function(pos, val) {
    var change = {};
    change[pos] = {$set: val};

    var newPlays = update(this.state.plays, change);
    this.setState({plays: newPlays, hintEnabled: false, selectedPos: -1});
  },

  componentWillMount: function() {
    game = this;
  },

  enableHint: function() {
    this.setState({hintEnabled: true});
  },

  disableHint: function() {
    this.setState({hintEnabled: false});
  },

  setSelected: function() {
    var target = $(event.target);
    this.setState({selectedPos: target.data("pos")});
  },

  render: function() {
    var vals = this.props.board;
    var plays = this.state.plays;

    var hint = this.state.hintEnabled && calculateHint(vals, plays);
    var selectedPos = this.state.selectedPos;

    var rows = [1,2,3,4,5,6,7,8,9].map(function(r) {
      var rowName = "r" + r;
      var cols = [1,2,3,4,5,6,7,8,9].map(function(c) {
        var colName = "c" + c;
        var pos = 9 * r + c - 10;
        var posName = "p" + pos;
        var val = vals[pos];
        var content;
        var hinted = this.state.hintEnabled && isHinted(hint, rowName, colName, boxName(r, c), posName);
        var selected = (pos == selectedPos);
        var given = (vals[pos] > 0);
        var selectable = !given;

        if (given) {
          content = val;
        } else {
          content = plays[pos];
        }

        var classes = [colName, hinted ? "hinted" : "", selected ? "selected" : "", given ? "given" : ""].join(" ");

        var tdProps = {
          key: pos,
          className: classes,
          "data-pos": pos
        }
        if (selectable) {
          tdProps.onMouseDown = this.setSelected;
          tdProps.onTouchStart = this.setSelected;
        }
        return (
          <td {...tdProps}>
            {content}
          </td>
        );
      }.bind(this));
      return <tr key={rowName} className={rowName}>{cols}</tr>;
    }.bind(this));

    return (
      <div>
        <Hint hint={hint} />
        <table>{rows}</table>
        <ValueSelect selectedPos={this.state.selectedPos} />
      </div>
    );
  }
});
