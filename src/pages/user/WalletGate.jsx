import useAuth from "../../hooks/useAuth";

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
            <div className="auth-loading-screen wallet-gate-loading">
                <div className="auth-loading-card">
                    <div className="auth-loading-spinner" />

                    <div>
                        <strong>
                            Salok Earn
                        </strong>

                        <span>
                            Loading your wallet...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return isAuthenticated ? (
        <WalletPage />
    ) : (
        <WalletPreview />
    );
}

export default WalletGate;
