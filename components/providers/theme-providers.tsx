import  React, {ReactNode} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";


/* export function ThemeProvider({
    children,
    ...props
} : React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} */
const ThemeProvider = ({children}: {children : ReactNode}) => {
    return (
        <NextThemesProvider attribute="class" enableSystem defaultTheme="system">
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;