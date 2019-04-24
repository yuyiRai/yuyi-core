import * as React from 'react'

export class AppTest extends React.Component {
  state = {
    title: 'React Component Test'
  }
  render() {
    console.log('React Component Test', this.props)
    return <p>{this.state.title}1{this.props.children}</p>
  }
}