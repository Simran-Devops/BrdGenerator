"use client"
import React, { useEffect, useState } from 'react'
import Anthropic from '@anthropic-ai/sdk';
import { marked } from 'marked';
import { EventSourcePolyfill } from 'event-source-polyfill';
import fs from 'fs';
import yaml from 'js-yaml';
import styles from "./Input.module.css";

const anthropic = new Anthropic({
    apiKey:process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true // defaults to process.env["ANTHROPIC_API_KEY"]
});

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

    const [generatedBRD, setGeneratedBRD] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    // New state for each BRD part
    const [brdPart1, setBrdPart1] = useState("");
    const [brdPart2, setBrdPart2] = useState("");
    const [brdPart3, setBrdPart3] = useState("");
    const [brdPart4, setBrdPart4] = useState("");

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

    const handleClientFocus = () => setClientIsFocused(true);
    const handleClientBlur = () => setClientIsFocused(false);
    const handleReqFocus = () => setReqIsFocused(true);
    const handleReqBlur = () => setReqIsFocused(false);
    const handleUserFocus = () => setUserFocused(true);
    const handleUserBlur = () => setUserFocused(false);
    const handleDeliverableFocus = () => setDeliverableFocused(true);
    const handleDeliverableBlur = () => setDeliverableFocused(false);

    useEffect(() => {
        let count = 0;
        if (clientName.trim() != "") count++;
        if (projectRequirements.trim() != "") count++;
        if (Users.trim() != "") count++;
        if (Deliverables.trim() != "") count++;
        setNum(count);
    }, [clientName, projectRequirements, Users, Deliverables]);

    useEffect(() => {
        // Combine all BRD parts
        setGeneratedBRD(brdPart1 + brdPart2 + brdPart3 + brdPart4);
    }, [brdPart1, brdPart2, brdPart3, brdPart4]);

    const totalFields = 4;

    const generateBRD = async () => {
        if (!clientName || !projectRequirements || !Users || !Deliverables) {
            alert("please fill in all fields before generating the BRD");
            return;
        }
        // Load confidentiality agreement from YAML file
        const response = await fetch('/confidentiality_agreement.yaml');
        const confidentialityAgreement = await response.text();
        setIsGenerating(true);
        setBrdPart1('');
        setBrdPart2('');
        setBrdPart3('');
        setBrdPart4('');

        // generate BRD parts using anthropic key
        await generateBRDPart(anthropic, `Create the first part of a detailed Business Requirements Document (BRD) for the following project:
          ClientName: ${clientName}
          Project Description and Requirements: ${projectRequirements}
          Types of users:${Users}
          Project Deliverables:${Deliverables}
          Include the follwing sections:
            1.Confidentiality Agreement: Use the following agreement:
            ${confidentialityAgreement}
            
            2. Executive Summary: 
      - Provide a brief overview of the project, its objectives, key stakeholders & deliverables.

           3. Project Approach: 
      - Describe the methodology, timeline, and key milestones based on the deliverables of the project in a table.
      - Add a note mentioning that they are just for references only, final milestones will be provided in further discussions.

      Provide detailed and professional content for each section, incorporating all the provided information.
      Use Markdown formatting for proper structure.
      Do not include a title for the BRD itself, as it will be added separately.
          `, setBrdPart1);

        await generateBRDPart(anthropic, `Create the second part of a detailed Business Requirements Document (BRD) for the following project:
      Client Name: ${clientName}
      Project Description and Requirements:
      ${projectRequirements}
      Types of Users:
      ${Users}
      Project Deliverables:
      ${Deliverables}

      Now, include the following sections:
      1. Functional Requirements:
      - For each deliverable, create at least 48 detailed modules as per requirement.
      - Structure each requirement as: Module, Sub - Module (Optional), Description.
      - Ensure the requirements are comprehensive and cover all aspects of the project.
      - Write description of each module in 3 or more lines respectively.
      - Descripton must be present against each module.
        - For each user-side module, include a corresponding management module in the admin panel.
      - Don't use any keywords like Module & Description in output.

      2. 3rd Party Integrations and API Suggestions:
      - Based on the functional requirements, suggest potential 3rd party integrations or APIs that could be used to implement or enhance various features of the system.
      - For each suggestion, provide:
        a. Name of the 3rd party service or API
        b. Brief description of its functionality or requirement it can address
        c. Try to suggest API or services specifically for Indian region & Mention their international alternatives too if client is from any other country.

      Provide detailed and professional content, incorporating all the provided information and ensuring consistency with the previously generated sections.
      Use Markdown formatting for proper structure.
        `, setBrdPart2);

        await generateBRDPart(anthropic, `
  Create the third part of a detailed Business Requirements Document (BRD) for the following project:

  Client Name: ${clientName}
  Project Description and Requirements:
  ${projectRequirements}
  Types of Users:
  ${Users}
  Project Deliverables:
  ${Deliverables}

  Now, include the following sections:
      1. Continue the functional requirements if it's absolute necessary or continue to non functional requirements.

      2. Non-Functional Requirements: 
      Specify performance, security, scalability, and other non-functional aspects of the system.

      Provide detailed and professional content for each section, incorporating all the provided information and ensuring consistency with the previously generated sections.
      Use Markdown formatting for proper structure, including tables where specified.
        `, setBrdPart3);

        await generateBRDPart(anthropic, `
  Create the fourth part of a detailed Business Requirements Document (BRD) for the following project:

  Client Name: ${clientName}
  Project Description and Requirements:
  ${projectRequirements}
  Types of Users:
  ${Users}
  Project Deliverables:
  ${Deliverables}

  Now, include the following section:
  Annexure: 
  a. Functional Requirements: Create a separate table for each deliverable in the Functional Requirements. Each table should have the following columns:
  - Requirement ID
  - Module
  - Description

  b. 3rd Party Services and APIs: Create a table summarizing all suggested 3rd party services and APIs. This table should have the following columns:
  - Service/API Name
  - Functional Area
  - Description

  Provide detailed and professional content for this section, incorporating all the provided information and ensuring consistency with the previously generated sections.
  Use Markdown formatting for proper structure, including tables where specified.
        `, setBrdPart4);

        setIsGenerating(false);
    }

    const generateBRDPart = async (
        anthropic: Anthropic,
        prompt: string,
        setResponse: React.Dispatch<React.SetStateAction<string>>
    ) => {
        try {
            let responseText = '';

            const stream = await anthropic.messages.stream({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 8192,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            stream.on('text', async (text: string) => {
                responseText += text;
                const parsedResponse = await marked(responseText);
                setResponse(parsedResponse);
            });

            stream.on('error', (error) => {
                console.error('Error generating BRD part:', error);
                throw error;
            });

            await new Promise<void>((resolve) => {
                stream.on('end', () => {
                    resolve();
                });
            });

            return responseText;
        } catch (error) {
            console.error('Error generating BRD part:', error);
            throw error;
        }
    };

    return (
        <div className="p-10 md:p-20 flex flex-col gap-5 w">
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

                    {isClientExpanded && (
                        <div className="flex flex-col gap-2 mt-4">
                            <label className="text-sm font-light" >Client Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter the client's name(e.g., Acme Corporation)" 
                                value={clientName} 
                                onFocus={handleClientFocus} 
                                onBlur={handleClientBlur} 
                                onChange={(e) => setClientName(e.target.value)} 
                                className="text-sm"
                                style={{
                                    outline: isClientFocused ? '1px solid #fdaeaf' : 'none',
                                    backgroundColor: '#f0f2f6',
                                    padding: '7px',
                                    borderRadius: '5px',
                                }} 
                            />
                            <label className="text-sm font-light mt-3">Project Descriptions and Requirements</label>
                            <textarea 
                                placeholder="Project Requirements and Description" 
                                value={projectRequirements} 
                                onChange={(e) => setProjectRequirements(e.target.value)} 
                                onFocus={handleReqFocus} 
                                onBlur={handleReqBlur} 
                                className="text-sm"
                                style={{
                                    outline: isReqFocused ? '1px solid #fdaeaf' : 'none',
                                    backgroundColor: '#f0f2f6',
                                    padding: '7px',
                                    borderRadius: '5px',
                                    minHeight: '180px'
                                }}
                            ></textarea>
                        </div>
                    )}
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

                    {isProjectExpanded && (
                        <div className="flex flex-col md:flex-row gap-2 mt-4">
                            <div className="flex-1 flex flex-col gap-1">
                                <label className="text-sm font-light" >Type of Users</label>
                                <textarea 
                                    placeholder="List the different types of users who will interact with the system, one per line(e.g., Admin, Customer, Guest)" 
                                    value={Users} 
                                    onChange={(e) => setUsers(e.target.value)} 
                                    onFocus={handleUserFocus} 
                                    onBlur={handleUserBlur} 
                                    className="text-sm"
                                    style={{
                                        outline: isUserFocused ? '1px solid #fdaeaf' : 'none',
                                        backgroundColor: '#f0f2f6',
                                        padding: '7px',
                                        borderRadius: '5px',
                                        minHeight: '180px'
                                    }}
                                ></textarea>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <label className="text-sm font-light">Project Deliverables</label>
                                <textarea 
                                    placeholder="List the main deliverables or components of the project, one per line(e.g., User Dashboard, Admin Panel, API Integration)" 
                                    value={Deliverables} 
                                    onChange={(e) => setDeliverables(e.target.value)} 
                                    onFocus={handleDeliverableFocus} 
                                    onBlur={handleDeliverableBlur} 
                                    className="text-sm"
                                    style={{
                                        outline: isDeliverableFocused ? '1px solid #fdaeaf' : 'none',
                                        backgroundColor: '#f0f2f6',
                                        padding: '7px',
                                        borderRadius: '5px',
                                        minHeight: '180px'
                                    }}
                                ></textarea>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    className="p-2 pl-1 pr-1 border border-black-100 w-36 hover:text-[white] hover:border-[red] hover:bg-[red] text-sm rounded-xl" 
                    onClick={generateBRD}
                >
                    Generate BRD
                </button>
                {isGenerating && (
                    <div className="mt-8">
                        <p className="text-lg">Generating BRD...</p>
                    </div>
                )}
                {generatedBRD && (
                    <div className="mt-8">
                        <div className="p-4 rounded-md overflow-x-auto">
                            <div 
                                className={`whitespace-pre-wrap generated-brd ${styles['generated-brd']}`}
                                dangerouslySetInnerHTML={{ __html: generatedBRD }}
                            />
                        </div>
                    </div>
                )}
                <hr className="mt-7 mb-7" />
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-medium">How to use this BRD Generator</h1>
                    <ol className="list-decimal list-inside pr-4 flex flex-col gap-2">
                        <li className="text-sm">Fill in all the required fields in the form above.</li>
                        <li className="text-sm">Click on the "Generate BRD" button to create your Business Requirements Document.</li>
                        <li className="text-sm">The generated BRD will be displayed on this page.</li>
                        <li className="text-sm">You can download the BRD as a Markdown file, PDF, or DOCX using the buttons provided.</li>
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
