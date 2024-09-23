import React,{useState} from 'react'

const Input = () => {
    const [num,setNum]=useState<Number>(0)
  return (
    <div className="p-10 md:p-20 flex flex-col gap-5">
       <h1 className="font-medium text-3xl">EMB-AI BRD Studio</h1>
     <p className="text-sm">This app generates a comprehensive Business Requirements Document (BRD) based on your inputs. Fill in the fields below and click 'Generate BRD' to create your document.</p>
      <p>Form Completion: /4 fields</p>
    </div>
  )
}

export default Input
