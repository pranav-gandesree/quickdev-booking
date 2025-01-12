import React from 'react';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const Navbar = () => {
  return (
    <div>
      <WalletModalProvider>
        <div style={{
          display: 'flex',
          justifyContent: 'end',
          padding: 20,
          gap: 4
        }}>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
      </WalletModalProvider>
    </div>
  );
};

export default Navbar;
