import React, { useState } from 'react'

function MultipleFiles() {
  const [multipleFiles, setMultipleFiles] = useState<any>([])

  const onChangeFiles = (e: any) => {
  }

  return (
    <div className='multiple-files'>
      <div className='multiple-files___body'>
        <input type='file' multiple onChange={onChangeFiles} className='multiple-files___body--input' />
      </div>
    </div>
  )
}

export default MultipleFiles