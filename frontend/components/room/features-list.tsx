import { LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesListProps {
  features: FeatureItem[];
}

export function FeaturesList({ features }: FeaturesListProps) {
  return (
    <div className="flex flex-col gap-6 py-8 border-b border-neutral-200">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="flex gap-4">
            <Icon className="w-7 h-7 text-neutral-800" strokeWidth={1.5} />
            <div>
              <h3 className="font-semibold text-[16px] text-neutral-900">{feature.title}</h3>
              <p className="text-neutral-500 text-sm mt-0.5">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
