import React, { Component } from 'react'
import logo from '../static/images/logo.svg'
import '../static/css/App.css'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Instructor's Dashboard</h1>
                </header>
                
            </div>
        )
    }
}

export default App;