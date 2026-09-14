import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

import WalletPage from "./WalletPage";
import WalletPreview from "./WalletPreview";

import "./wallet-preview.css";

/*
|--------------------------------------------------------------------------
| Wallet Gate
|--------------------------------------------------------------------------
|
| The Wallet nav item is visible to everyone, including guests, so
| visitors can see what the wallet experience looks like. Signed-in
| members get the real wallet with their balance and transaction
| history; everyone else sees a locked preview that sells the
| feature and pushes toward creating an account.
|
*/

function WalletGate() {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    if (loading) {
        return (
            <Loader
                fullScreen
                size="lg"
                label="Loading your wallet..."
            />
        );
    }

    return isAuthenticated ? (
        <WalletPage />
    ) : (
        <WalletPreview />
    );
}

export default WalletGate;
