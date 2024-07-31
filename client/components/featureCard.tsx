import React from "react"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"

interface featureprop {feature : {title : string , description : string , img : string}}

export const FeatureCard:React.FC<featureprop>  = ({feature}:{feature : {title : string , description : string , img : string}})=>{
    return(
        <Card>
            <CardContent className="flex p-4 gap-2 transition-transform duration-200 ease-in-out hover:scale-105">
                <img src={feature.img} alt="img" width={72} height={60}></img>
                <div className="flex flex-col gap-1">
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </div>
            </CardContent>
        </Card>
    )
}