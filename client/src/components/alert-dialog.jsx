import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function alertDialog({ variant = 'default', title, desc }) {
    return (
        <Alert variant={variant} className={`flex space-x-2`}>
            <AlertTitle>{title}:</AlertTitle>
            <AlertDescription>
                {desc}
            </AlertDescription>
        </Alert>
    )
}