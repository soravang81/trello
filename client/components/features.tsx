import  {FeatureCard} from "./featureCard"
import React from "react"

const features = [
    {
        title : "Introducing tags",
        description : "Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.",
        img : "/p1.png"
    },
    {
        title : "Share Notes Instantly",
        description : "Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options.",
        img : "/p2.png"
    },
    {
        title : "Access Anywhere",
        description : "Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer.",
        img : "/p3.png"
    }
]
export const Features: React.FC = () => {
    return (
      <>
        <div className="flex p-4 gap-4 ">
            {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
            ))}
        </div>
      </>
    );
  };