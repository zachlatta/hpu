var injectTapEventPlugin = require('react-tap-event-plugin');
var converter = new Showdown.converter();

injectTapEventPlugin();

var TableBox = React.createClass({
  handleTableSubmit: function (comment) {
    var comments = this.state.data;
    var newTables = comments.concat([comment]);
  },
  getInitialState: function () {
    return {data: []}
  },
  componentDidMount: function () {
    this.loadTablesFromServer();
  },
  render: function () {
    return (
      <div className="commentBox">
        <h1>Tables</h1>
        <TableList data={this.state.data}/>
        <TableForm onTableSubmit={this.handleTableSubmit} />
      </div>
    );
  }
});

var TableList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Table author={comment.author}>
          {comment.text}
        </Table>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var TableForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onTableSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function () {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Table = React.createClass({
  render: function () {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

React.render(
  <TableBox url="http://mew.hackedu.us:4000/comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
