/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import { Debugger } from './debugger/Debugger'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Debugger />
  </React.StrictMode>
)
