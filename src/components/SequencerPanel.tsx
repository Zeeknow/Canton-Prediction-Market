import React from 'react';

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const ScaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);
const ArchiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SequencerPanel: React.FC = () => {
    const timelineEvents = [
        {
            icon: <ShieldCheckIcon />,
            title: '1. Place Bet (Encrypted)',
            description: 'Your financial data and bet choices are cryptographically sealed on your device before being sent to the network, ensuring complete privacy from the start.',
        },
        {
            icon: <ScaleIcon />,
            title: '2. Market Resolution (Blind Oracle)',
            description: 'An independent Oracle provides the real-world outcome. This Oracle is kept blind to all financial data, ensuring their decision is neutral and trustworthy.',
        },
        {
            icon: <CheckCircleIcon />,
            title: '3. Market Settled (Private Payouts)',
            description: 'The Market Operator triggers the settlement, and winnings are distributed. Sub-Transaction Privacy means the network validates this without seeing who was paid or how much.',
        },
        {
            icon: <ArchiveIcon />,
            title: '4. Archive & Redact',
            description: 'After settlement, the Market Operator can trigger a GDPR-compliant redaction. This permanently obfuscates the financial details of the market, leaving only the outcome.',
        },
        {
            icon: <CheckCircleIcon />,
            title: '5. PII & The Right to be Forgotten',
            description: "Redaction fulfills the 'Right to be Forgotten' by making it impossible to link past activity to any individual, guaranteeing user privacy at the protocol level.",
        }
    ];

  return (
    <div className="bg-gray-800/30 rounded-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            How Canton's Privacy Works
        </h2>
        <p className="mt-4 text-lg text-gray-400">
            Follow a transaction from placement to redaction, showcasing Sub-Transaction Privacy.
        </p>
      </div>
      
      <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-700 transform md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
                 <div key={index} className="flex items-start md:items-center w-full">
                    <div className={`flex md:w-1/2 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end md:order-2'}`}>
                       <div className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 border-2 border-cyan-500 text-cyan-400 z-10 ${index % 2 === 0 ? '' : 'md:order-2'}`}>
                           {/* Dot on the timeline */}
                           <div className="absolute w-4 h-4 bg-cyan-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"></div>
                           {event.icon}
                       </div>
                    </div>
                    
                    <div className={`flex md:w-1/2 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end md:text-right'}`}>
                        <div className={`w-full md:w-10/12 ml-8 md:ml-0 ${index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                            <h4 className="font-bold text-lg text-white">{event.title}</h4>
                            <p className="text-gray-400 mt-1">{event.description}</p>
                        </div>
                    </div>
                 </div>
            ))}
          </div>
      </div>

    </div>
  );
};

export default SequencerPanel;