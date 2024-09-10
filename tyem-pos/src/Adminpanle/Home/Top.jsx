import React from 'react'

const Top = () => {
  return (
    <div>
      <header className="bg-purple-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Share store link</h1>
        <a href="https://demodemo.posbytz.com" className="text-blue-200 underline">
          https://demodemo.posbytz.com
        </a>
      </div>
      <div className="flex space-x-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">Configure your Custom domain</button>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-2 py-2 rounded-full">F</button>
          <button className="bg-green-400 text-white px-2 py-2 rounded-full">W</button>
          <button className="bg-blue-400 text-white px-2 py-2 rounded-full">T</button>
        </div>
      </div>
    </header>
    </div>
  )
}

export default Top
