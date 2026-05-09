import React from 'react'

const Logo = () => {
  return (
    <div className='flex items-center space-x-3'>
      <div className="relative w-10 h-10 rounded-xl bg-blue-700 dark:bg-blue-400 flex items-center justify-center">
        <span className="text-white font-bold text-lg">Y</span>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full"></div>
      </div>

      <h1 className='hidden sm:block text-xl md:text-2xl font-bold text-blue-800 dark:text-blue-400'>
        Portfolio
      </h1>
    </div>
  )
}

export default Logo