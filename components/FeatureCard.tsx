import { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          {icon}
          <h3 className="mt-4 font-semibold text-lg">{title}</h3>
          <p className="mt-2 text-slate-400 text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
