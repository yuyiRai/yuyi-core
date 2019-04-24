import * as React from 'react'

export class AppTest extends React.Component {
  state = {
    title: 'React Component Test'
  }
  render() {
    return <p>{this.state.title}</p>
  }
}