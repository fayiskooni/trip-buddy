import { LucideIcon } from "lucide-react";

type DescriptionProps = {
  content: string;
  icon: LucideIcon;
  title: string;
  title2: string;
  title3: string;
  description: string;
  description2: string | null;
};

const Description = ({
  icon: Icon,
  content,
  title,
  title2,
  title3,
  description,
  description2,
}: DescriptionProps) => {
  return (
    <div className="bg-background mt-40 flex flex-col items-center justify-center">
      <div className="flex items-center h-14  text-black">
        <span className="border px-4 py-1 rounded-4xl h-full flex items-center justify-center">
          {content}
        </span>
        <span className="border px-4 py-1 rounded-full h-full flex items-center justify-center">
          <Icon />
        </span>
      </div>
      <span className="text-5xl text-black mt-10 flex flex-col items-center">
        <span className="mb-3 flex gap-2">
          <h1>{title}</h1>
          <h1 className="text-muted-foreground">{title2}</h1>
        </span>

        <h1>{title3}</h1>
      </span>
      <span className="text-muted-foreground mt-5 flex flex-col items-center">
        <p>{description}</p>
        <p>{description2}</p>
      </span>
    </div>
  );
};

export default Description;
