import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon } from "lucide-react";
type price = {
  name: string;
  price: string;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  priceId: string;
};

const plans = [
  { 
    id: 'basic',
    name: 'Basic',
    price:"9",
    description:"perfect for ocational use",
    items:[
      "5 PDF per month",
      "Standard processing speed",
      "Email support",
    ],
    paymentLink: "https://buy.stripe.com/3csbJY2aQ4kK0cE5k1",
    priceId: "price_1NQ0v2K3x4kK0cE5k1",
  },
  { 
    id: 'pro',
    name: 'pro',
    price:"19",
    description:"For professionals and teams",
    items:[
      "Unlimited PDF summaries",
      "Priority processing",
      "24x7 priority support",
      "Markdown export",
    ],
    paymentLink: "https://buy.stripe.com/3csbJY2aQ4kK0cE5k1",
    priceId: "price_1NQ0v2K3x4kK0cE5k1",
  },
];

const PricingCard = ({ 
  name,
  price,
  description,
  items,
  id,
  paymentLink,
}: price) => {
  return (
    <div className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300">
      <div className={cn("relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500 rounded-2xl",
        id === "pro" && "border-rose-500 gap-5 border-2" 
      )}>
        <div className="flex justify-between items-center gap-4">
          <div>
          <p className="text-lg lg:text-4xl capitalize font-bold">{name}</p>
          <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">${price}</p>
          <div className="flex flex-col justify-end mb-[5px]">
          <p className="text-xs uppercase font-semibold">USD</p>
          <p className="text-xs">/month</p>
          </div>
        </div>

        <div className="space-y-2.5 leading-relaxed text-base flex-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckIcon size={18}  />
              {item}
            </li>
          ))}
        </div>
      
        <div
          className="space-y-2 flex justify-center w-full "
        >
          <Link href={paymentLink}
            className={cn("w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-800 to-rose-500 text-white hover:bg-linear-to-l hover:from-rose-800 hover:to-rose-500 border-2 py-2",
              id === "pro" 
                ? 'border-rose-900' 
                : 'border-rose-100 from-rose-400 to-rose-500'
            )}
          >Buy Now<ArrowRight/></Link>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12 ">
        <div className="flex items-center justify-center w-full pb-12">
          <h2 className="text-xl uppercase font-extrabold mb-8 text-rose-500">Pricing</h2>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <PricingCard 
              key={plan.id} 
              name={plan.name} 
              price={plan.price} 
              description={plan.description} 
              items={plan.items} 
              id={plan.id} 
              paymentLink={plan.paymentLink} 
              priceId={plan.priceId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
