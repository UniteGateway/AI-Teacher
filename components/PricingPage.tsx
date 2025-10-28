import React, { useState } from 'react';
import { Currency, PricingPlan, UserRole } from '../types';

type BillingCycle = 'monthly' | 'yearly';

const PRICING_DATA: Record<UserRole, PricingPlan[]> = {
  [UserRole.STUDENT]: [
    {
      name: 'Basic',
      price: { monthly: 'Free', yearly: 'Free' },
      description: 'For individuals just getting started with AI-powered learning.',
      features: [
        'Access to 1 AI Teacher',
        '10 chat sessions per month',
        'Basic analytics',
        'Community support',
      ],
    },
    {
      name: 'Pro',
      price: { monthly: 15, yearly: 144 },
      description: 'For dedicated learners who want the full experience.',
      features: [
        'Access to all AI Teachers',
        'Unlimited chat sessions',
        'Unlimited virtual calls',
        'Advanced learning analytics',
        'Session history',
        'Priority email support',
      ],
      isFeatured: true,
    },
    {
      name: 'Premium',
      price: { monthly: 25, yearly: 240 },
      description: 'For learners who want live, one-on-one help.',
      features: [
          'Everything in Pro, plus:',
          '2 hours of live expert tutoring per month',
          'Personalized learning plans',
          'Early access to new features',
      ]
    },
  ],
  [UserRole.TEACHER]: [
     {
      name: 'Starter',
      price: { monthly: 29, yearly: 290 },
      description: 'For individual teachers enhancing their classroom.',
      features: [
        'Create 1 custom AI assistant',
        'Manage up to 30 students',
        'Basic student progress tracking',
        'Access to community resources',
      ],
    },
    {
      name: 'Professional',
      price: { monthly: 49, yearly: 490 },
      description: 'For educators who need more powerful tools.',
      features: [
        'Create 5 custom AI assistants',
        'Manage up to 150 students',
        'Advanced analytics dashboard',
        'Custom branding for your portal',
        'Priority support',
      ],
      isFeatured: true,
    },
    {
      name: 'Studio',
      price: { monthly: 99, yearly: 990 },
      description: 'For power users creating and selling courses.',
      features: [
        'Everything in Professional, plus:',
        'Unlimited custom AI assistants',
        'Manage unlimited students',
        'Monetization tools',
        'API access for integrations',
      ],
    },
  ],
  [UserRole.MANAGEMENT]: [
    {
      name: 'Small Campus',
      price: { monthly: 299, yearly: 2990 },
      description: 'For smaller schools or departments.',
      features: [
        'Up to 20 teacher accounts',
        'Up to 500 student accounts',
        'Campus-wide analytics',
        'Centralized content management',
        'Standard onboarding',
      ],
    },
    {
      name: 'District',
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'For school districts and larger institutions.',
      features: [
        'Everything in Small Campus, plus:',
        'Unlimited teacher & student accounts',
        'Single Sign-On (SSO)',
        'Dedicated account manager',
        'Custom data reporting',
        'Premium support & training',
      ],
      isFeatured: true,
    },
  ],
   [UserRole.ADVERTISER]: [
    {
      name: 'Starter',
      price: { monthly: 100, yearly: 1000 },
      description: 'For small businesses testing the waters.',
      features: [
        'Up to 50,000 monthly impressions',
        'Basic targeting options',
        'Performance analytics dashboard',
        'Self-service ad platform',
      ],
    },
    {
      name: 'Growth',
      price: { monthly: 500, yearly: 5000 },
      description: 'For growing brands looking to scale their reach.',
      features: [
        'Up to 300,000 monthly impressions',
        'Advanced demographic targeting',
        'A/B testing for creatives',
        'Email support',
      ],
      isFeatured: true,
    },
    {
      name: 'Scale',
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'For large advertisers with specific campaign goals.',
      features: [
        'Everything in Growth, plus:',
        'Unlimited impressions',
        'Dedicated campaign manager',
        'API access for reporting',
        'Creative services available',
      ],
    },
  ],
};


const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const PricingCard: React.FC<{
  plan: PricingPlan;
  currency: Currency;
  billingCycle: BillingCycle;
}> = ({ plan, currency, billingCycle }) => {
  const { name, price, description, features, isFeatured } = plan;

  const cardClasses = `bg-gray-800/50 p-8 rounded-2xl flex flex-col relative ${
    isFeatured ? 'border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'border border-gray-700'
  }`;
  
  const buttonClasses = `w-full py-3 mt-8 font-semibold rounded-lg transition-transform transform hover:scale-105 ${
    isFeatured ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
  }`;

  const currentPrice = billingCycle === 'monthly' ? price.monthly : price.yearly;
  const isYearly = billingCycle === 'yearly';

  return (
    <div className={cardClasses}>
      {isFeatured && (
        <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-3 self-center">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-2xl font-bold text-white text-center">{name}</h3>
      <p className="text-center text-gray-400 mt-2 h-10">{description}</p>
      <div className="mt-6 text-center">
        <span className="text-5xl font-extrabold text-white">
            {currentPrice === 'Free' ? 'Free' : currentPrice === 'Custom' ? 'Custom' : `${currency.symbol}${currentPrice}`}
        </span>
        <span className="text-gray-400">
            {(currentPrice !== 'Free' && currentPrice !== 'Custom') && (isYearly ? '/ year' : '/ month')}
        </span>
        {isYearly && typeof price.monthly === 'number' && typeof price.yearly === 'number' && (
             <p className="text-xs text-green-400 mt-1">
                Save {currency.symbol}{price.monthly * 12 - price.yearly}!
             </p>
        )}
      </div>
      <ul className="mt-8 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckIcon />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={buttonClasses}>
        {name === 'Basic' ? 'Get Started' : currentPrice === 'Custom' ? 'Contact Sales' : 'Choose Plan'}
      </button>
    </div>
  );
};

interface PricingPageProps {
    currency: Currency;
}

const PricingPage: React.FC<PricingPageProps> = ({ currency }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.STUDENT);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const RoleButton: React.FC<{role: UserRole, label: string}> = ({ role, label }) => (
     <button
      onClick={() => setActiveRole(role)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeRole === role ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Plans for every <span className="text-indigo-400">role</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400">
          Flexible pricing for everyone. Switch between roles to see tailored plans. Prices shown in {currency.code}.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        {/* Role Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700">
            <RoleButton role={UserRole.STUDENT} label="For Students" />
            <RoleButton role={UserRole.TEACHER} label="For Teachers" />
            <RoleButton role={UserRole.MANAGEMENT} label="For Management" />
            <RoleButton role={UserRole.ADVERTISER} label="For Advertisers" />
        </div>
        {/* Billing Cycle Toggle */}
        <div className="flex items-center gap-3">
            <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
             <button onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')} className={`w-12 h-6 rounded-full p-1 transition-colors ${billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`font-semibold ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
             <span className="text-xs font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full">Save up to 17%</span>
        </div>
      </div>


      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {PRICING_DATA[activeRole].map(plan => (
            <PricingCard key={plan.name} plan={plan} currency={currency} billingCycle={billingCycle} />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;