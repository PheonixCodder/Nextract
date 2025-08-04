'use client'
import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface Props {
    title?: string;
    subTitle?: string;
    icon?: LucideIcon;

    titleClassName?: string;
    subTitleClassName?: string;
    iconClassName?: string;
}
export default function CustomDialogHeader(props: Props) {
    const Icon = props.icon
    const Title = props.title
    const SubTitle = props.subTitle

    return (
        <DialogHeader className="py-6">
            <DialogTitle asChild>
                <div className="flex flex-col items-center gap-2 mb-2">
                    {Icon &&( <Icon size={30} className={cn('stroke-primary', props.iconClassName)} />)}
                    {Title && (<p className={cn('text-xl text-primary', props.titleClassName)}>{Title}</p>)}
                    {SubTitle && (<p className={cn('text-sm text-muted-foreground', props.subTitleClassName)}>{SubTitle}</p>)}
                </div>
            </DialogTitle>
            <Separator />
        </DialogHeader>
    )
}