var game;
var update = React.addons.update;

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

var Game = React.createClass({

  getInitialState: function() {
    return { plays: [] };
  },

  play: function(pos, val) {
    var change = {};
    change[pos] = {$set: val};

    var newPlays = update(this.state.plays, change);
    this.setState({plays: newPlays});
  },

  handleChange: function(event) {
    var target = $(event.target);
    var val = fixVal(target.val());
    sendPlayEvent(target.data("pos"), val);
  },

  componentWillMount: function() {
    game = this;
  },

  render: function() {
    var vals = this.props.board;
    var plays = this.state.plays;

    var rows = [1,2,3,4,5,6,7,8,9].map(function(r) {
      var rowName = "r" + r;
      var cols = [1,2,3,4,5,6,7,8,9].map(function(c) {
        var colName = "c" + c;
        var pos = 9 * r + c - 10;
        var val = vals[pos];
        var content;

        if (vals[pos] != '.') {
          content = <input type="text" value={val} disabled />;
        } else {
          content = <input type="text" value={plays[pos]} onChange={this.handleChange} data-pos={pos}/>;
        }

        return (
          <td key={pos} className={colName}>
          {content}
          </td>
        );
      }.bind(this));
      return <tr key={rowName} className={rowName}>{cols}</tr>;
    }.bind(this));

    return <table>{rows}</table>;
  }
});
