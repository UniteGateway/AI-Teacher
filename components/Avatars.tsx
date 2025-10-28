import React from 'react';

export const ScientistAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* Background */}
        <circle cx="100" cy="100" r="98" fill="url(#sci_grad_bg)"/>
        
        {/* Head */}
        <circle cx="100" cy="95" r="50" fill="#f0d4c9"/>
        
        {/* Hair */}
        <path d="M 65,55 Q 100,30 135,55 L 140,80 Q 100,85 60,80 Z" fill="#4a3a30"/>
        
        {/* Lab Coat */}
        <path d="M 60,140 L 50,190 H 150 L 140,140 V 110 Q 100,120 60,110 Z" fill="#ffffff"/>
        <path d="M 100,115 V 190 M 60,110 Q 100,120 140,110" stroke="#d1d5db" strokeWidth="4" fill="none"/>
        <path d="M 80,115 L 100,135 L 120,115" fill="#3b82f6"/>

        {/* Glasses */}
        <g stroke="#374151" strokeWidth="3" fill="none">
            <circle cx="80" cy="85" r="12"/>
            <circle cx="120" cy="85" r="12"/>
            <path d="M 92,85 H 108"/>
            <path d="M 68,85 H 60 Q 50,80 55,70"/>
            <path d="M 132,85 H 140 Q 150,80 145,70"/>
        </g>
        
        {/* Features */}
        <circle cx="80" cy="85" r="3" fill="#2c2222"/>
        <circle cx="120" cy="85" r="3" fill="#2c2222"/>
        <path d="M 90,115 Q 100,125 110,115" stroke="#9d8880" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M 70,75 Q 75,70 80,70" stroke="#4a3a30" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 130,75 Q 125,70 120,70" stroke="#4a3a30" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </g>
      <defs>
        <radialGradient id="sci_grad_bg">
          <stop offset="50%" stopColor="#1e3a8a"/>
          <stop offset="100%" stopColor="#1e1b4b"/>
        </radialGradient>
      </defs>
    </svg>
);


export const ArtistAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* Background */}
        <circle cx="100" cy="100" r="98" fill="url(#art_grad_bg)"/>

        {/* Head */}
        <circle cx="100" cy="100" r="50" fill="#fcece5"/>

        {/* Hair */}
        <path d="M 50,100 C 40,50 80,30 100,40 C 120,30 160,50 150,100 L 145,130 C 130,150 70,150 55,130 Z" fill="#8e5a9c"/>
        <path d="M 120,40 C 130,50 140,60 135,70" stroke="#f472b6" strokeWidth="4" fill="none" />
        <circle cx="70" cy="65" r="5" fill="#60a5fa"/>

        {/* Clothing */}
        <path d="M 70,145 C 70,160 130,160 130,145 L 130,120 L 70,120 Z" fill="#34d399" />
        <path d="M 100,120 V 150" stroke="#10b981" strokeWidth="3" />
        <circle cx="100" cy="135" r="8" fill="#f59e0b" />
        
        {/* Features */}
        <ellipse cx="85" cy="95" rx="4" ry="7" fill="#2d572c"/>
        <ellipse cx="115" cy="95" rx="4" ry="7" fill="#2d572c"/>
        <path d="M 95,118 Q 100,125 105,118" stroke="#a16250" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 80,85 Q 85,80 90,85" stroke="#6b4f49" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 120,85 Q 115,80 110,85" stroke="#6b4f49" strokeWidth="3" fill="none" strokeLinecap="round"/>

        {/* Accessory */}
        <path d="M 45,90 L 55,80 L 60,85 Z" fill="#f87171"/>
      </g>
      <defs>
        <radialGradient id="art_grad_bg">
          <stop offset="50%" stopColor="#6d28d9"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
      </defs>
    </svg>
);


export const HistorianAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* Background */}
        <circle cx="100" cy="100" r="98" fill="url(#hist_grad_bg)"/>
        
        {/* Head */}
        <circle cx="100" cy="100" r="50" fill="#e4c7b8"/>

        {/* Hair and Beard */}
        <path d="M 70,60 Q 100,45 130,60 L 135,90 H 65 Z" fill="#e5e7eb"/>
        <path d="M 75,120 Q 100,150 125,120 L 120,115 Q 100,135 80,115 Z" fill="#e5e7eb"/>
        
        {/* Jacket */}
        <path d="M 60,145 L 50,195 H 150 L 140,145 V 120 H 60 Z" fill="#78350f"/>
        <path d="M 100,120 V 195 M 60,120 H 140" stroke="#9a3412" strokeWidth="4"/>
        <path d="M 70,120 L 100,140 L 130,120" fill="#f7b731"/>

        {/* Features */}
        <circle cx="85" cy="98" r="3" fill="#503d3f"/>
        <circle cx="115" cy="98" r="3" fill="#503d3f"/>
        <path d="M 80,120 Q 100,110 120,120" stroke="#6b4f49" strokeWidth="3" fill="none" strokeLinecap="round"/> {/* Moustache */}
        
        {/* Eyebrows */}
        <path d="M 80,85 Q 85,82 90,85" stroke="#d1d5db" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 120,85 Q 115,82 110,85" stroke="#d1d5db" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </g>
      <defs>
        <radialGradient id="hist_grad_bg">
          <stop offset="50%" stopColor="#92400e"/>
          <stop offset="100%" stopColor="#78350f"/>
        </radialGradient>
      </defs>
    </svg>
);