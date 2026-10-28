import './workspace.css';
import { StoreProvider } from './store';
import { Shell } from './ui';

export const metadata = { title: 'Workspace · Roveboard' };

export default function WorkspaceLayout({ children }) {
  return (
    <StoreProvider>
      <Shell>{children}</Shell>
    </StoreProvider>
  );
}
