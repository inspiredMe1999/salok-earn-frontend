import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import { AppRouter } from "./app/routes";

function App() {
    return (
        <AuthProvider>
            <AppRouter />

            <Toaster
                position="top-right"
                richColors
                closeButton
            />
        </AuthProvider>
    );
}

export default App;