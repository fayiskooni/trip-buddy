import Image from "next/image";

const CreateTrip = () => {
  return (
    <div className="fixed inset-0 overflow-hidden rounded-4xl m-4">
      {/* Background Image */}
      <Image
        src="/mountain.jpg"
        alt="background"
        fill
        priority
        className="object-cover scale-x-[-1]"
      />

      {/* Optional overlay */}
      <div className="absolute inset-0" />
    </div>
  );
};

export default CreateTrip;
