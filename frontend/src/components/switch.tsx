import { Button, ButtonProps } from "./ui/button"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"

interface SwitchButtonProps extends React.ComponentProps<typeof Button> {
    darkmode: boolean;
}

const Switch: React.ForwardRefRenderFunction<HTMLButtonElement, SwitchButtonProps> = ({ darkmode, className, variant, ...props }, ref) => {
    return (
        <div className="flex items-center justify-center">
            <Button {...props} size="icon" className={cn("rounded-none rounded-l-md w-10 h-10", className)} variant={!darkmode ? variant : 'default'} ref={ref}>
                <Moon className={`h-6 w-6 ${darkmode ? 'text-inverse' : 'text-text-hint'}`} />
            </Button>
            <Button {...props} size="icon" className={cn("rounded-none rounded-r-md w-10 h-10", className)} variant={darkmode ? variant : 'default'} ref={ref}>
                <Sun className={`h-6 w-6 ${!darkmode ? 'text-inverse' :  'text-text-hint'}`} />
            </Button>
        </div>
    );
};

export default React.forwardRef(Switch);