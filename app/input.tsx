"use client"
import React, { useEffect, useState } from 'react'

const Input = () => {
  const [num, setNum] = useState<number>(0)
  const [isClientExpanded, setClientIsExpanded] = useState(true);
  const [isProjectExpanded, setProjectIsExpanded] = useState(true);

  const [isClientFocused, setClientIsFocused] = useState(false);
  const [isReqFocused, setReqIsFocused] = useState(false);
  const [isUserFocused, setUserFocused] = useState(false);
  const [isDeliverableFocused, setDeliverableFocused] = useState(false);


  const [clientName, setClientName] = useState('');
  const [projectRequirements, setProjectRequirements] = useState('');
  const [Users, setUsers] = useState('');
  const [Deliverables, setDeliverables] = useState('');

  const handleClientToggle = (e: any) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      setClientIsExpanded(!isClientExpanded);

    }
  }
  const handleProjectToggle = (e: any) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      setProjectIsExpanded(!isProjectExpanded);

    }
  }

  const handleClientFocus = () => {
    setClientIsFocused(true);
  }
  const handleClientBlur = () => {
    setClientIsFocused(false);
  }
  const handleReqFocus = () => {
    setReqIsFocused(true);
  }
  const handleReqBlur = () => {
    setReqIsFocused(false);
  }
  const handleUserFocus = () => {
    setUserFocused(true);
  }
  const handleUserBlur = () => {
    setUserFocused(false);
  }
  const handleDeliverableFocus = () => {
    setDeliverableFocused(true);
  }
  const handleDeliverableBlur = () => {
    setDeliverableFocused(false);
  }
  useEffect(() => {
    let count = 0;
    if (clientName.trim() != "") {
      count++;
    }
    if (projectRequirements.trim() != "") {
      count++;
    }
    if (Users.trim() != "") {
      count++;
    }
    if (Deliverables.trim() != "") {
      count++;
    }
    setNum(count);
  }, [clientName, projectRequirements, Users, Deliverables]);

  const totalFields = 4;
  return (

    <div className="p-10 md:p-20 flex flex-col gap-5">
      <h1 className="font-medium text-3xl ">EMB-AI BRD Studio</h1>
      <p className="text-sm">This app generates a comprehensive Business Requirements Document (BRD) based on your inputs. Fill in the fields below and click 'Generate BRD' to create your document.</p>
      {/* progress bar */}
      <div className="w-full h-2 bg-[#f0f2f6] rounded mt-2 mb-2">
        <div className="bg-blue-600 h-2 rounded w-full" style={{ width: `${(num / totalFields) * 100}%` }}></div>
      </div>
      <p className="text-sm ">Form Completion: {num}/4 fields</p>
      {/* form */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 border border-black-200 p-3 rounded-md cursor-pointer" onClick={(e) => handleClientToggle(e)} >
          <div className="flex flex-row justify-between hover:text-[red] ">
            <h2 className="text-sm font-light">Client and Project Information</h2>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
                style={{ transform: isClientExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
              >
                <path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z" />
              </svg>

            </button>
          </div>

          {
            isClientExpanded && (
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-light" >Client Name</label>
                <input type="text" placeholder="Enter the client's name(e.g., Acme Corporation)" value={clientName} onFocus={handleClientFocus} onBlur={handleClientBlur} onChange={(e) => setClientName(e.target.value)} className="text-sm"
                  style={{
                    outline: isClientFocused ? '1px solid #fdaeaf' : 'none',
                    backgroundColor: '#f0f2f6',
                    padding: '7px',
                    borderRadius: '5px',

                  }} />
                <label className="text-sm font-light mt-3">Project Descriptions and Requirements</label>
                <textarea placeholder="Project Requirements and Description" value={projectRequirements} onChange={(e) => setProjectRequirements(e.target.value)} onFocus={handleReqFocus} onBlur={handleReqBlur} className="text-sm"
                  style={{
                    outline: isReqFocused ? '1px solid #fdaeaf' : 'none',
                    backgroundColor: '#f0f2f6',
                    padding: '7px',
                    borderRadius: '5px',
                    minHeight: '180px'
                  }}></textarea>
              </div>
            )
          }
        </div>

        {/* 2nd part */}
        <div className="flex flex-col gap-2 border border-black-200 p-3 rounded-md cursor-pointer" onClick={(e) => handleProjectToggle(e)} >
          <div className="flex flex-row justify-between hover:text-[red] ">
            <h2 className="text-sm font-light">Project Details</h2>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
                style={{ transform: isProjectExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
              >
                <path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z" />
              </svg>

            </button>
          </div>

          {
            isProjectExpanded && (
              <div className="flex flex-col md:flex-row gap-2 mt-4">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-sm font-light" >Type of Users</label>
                  <textarea placeholder="List the different types of users who will interact with the system, one per line(e.g., Admin, Customer, Guest)" value={Users} onChange={(e) => setUsers(e.target.value)} onFocus={handleUserFocus} onBlur={handleUserBlur} className="text-sm"
                    style={{
                      outline: isUserFocused ? '1px solid #fdaeaf' : 'none',
                      backgroundColor: '#f0f2f6',
                      padding: '7px',
                      borderRadius: '5px',
                      minHeight: '180px'
                    }}></textarea>           </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-sm font-light">Project Deliverables</label>
                  <textarea placeholder="List the main deliverables or components of the project, one per line(e.g., User Dashboard, Admin Panel, API Integration)" value={Deliverables} onChange={(e) => setDeliverables(e.target.value)} onFocus={handleDeliverableFocus} onBlur={handleDeliverableBlur} className="text-sm"
                    style={{
                      outline: isDeliverableFocused ? '1px solid #fdaeaf' : 'none',
                      backgroundColor: '#f0f2f6',
                      padding: '7px',
                      borderRadius: '5px',
                      minHeight: '180px'
                    }}></textarea>
                </div>

              </div>
            )
          }

        </div>

        <button className="p-2 pl-1 pr-1 border border-black-100  w-36 hover:text-[red] hover:border-[red] text-sm rounded-xl">Generate BRD</button>
        <hr className="mt-7 mb-7" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">How to use this BRD Generator</h1>
          <ol className="list-decimal list-inside pr-4 flex flex-col gap-2">
            <li className="text-sm">Fill in all the required fields in the form above.</li>
            <li className="text-sm">Click on the "Generate BRD" button to create your Business Requirements Document.</li>
            <li className="text-sm">
              The generated BRD will be displayed on this page.
            </li>
            <li className="text-sm">
              You can download the BRD as a Markdown file, PDF, or DOCX using the buttons provided.
            </li>
          </ol>
          <p className="text-sm">If you need to make changes, simply update the form fields and generate the BRD again.</p>
        </div>
        <hr className="mt-7 mb-7" />
        <p className="text-sm">© 2024 EMB-AI. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Input
