import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProductionPage } from './pages/ProductionPage';
import { HarvestPage } from './pages/HarvestPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { CustomersPage } from './pages/CustomersPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { SalesPage } from './pages/SalesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { ProfitLossPage } from './pages/ProfitLossPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { BackupPage } from './pages/BackupPage';
import { AuthPage } from './pages/AuthPage';

// Global Modals
import { NewOrderModal } from './components/modals/NewOrderModal';
import { LogHarvestModal } from './components/modals/LogHarvestModal';
import { NewBatchModal } from './components/modals/NewBatchModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { QuickSaleModal } from './components/modals/QuickSaleModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Modal States
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showLogHarvestModal, setShowLogHarvestModal] = useState(false);
  const [preselectedBatchId, setPreselectedBatchId] = useState<string | undefined>(undefined);
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);

  const handleOpenHarvestForBatch = (batchId: string) => {
    setPreselectedBatchId(batchId);
    setShowLogHarvestModal(true);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setActiveTab}
            onOpenNewOrder={() => setShowNewOrderModal(true)}
            onOpenLogHarvest={() => {
              setPreselectedBatchId(undefined);
              setShowLogHarvestModal(true);
            }}
            onOpenQuickSale={() => setShowQuickSaleModal(true)}
          />
        );
      case 'production':
        return (
          <ProductionPage
            onOpenNewBatch={() => setShowNewBatchModal(true)}
            onOpenLogHarvestForBatch={handleOpenHarvestForBatch}
          />
        );
      case 'harvest':
        return (
          <HarvestPage
            onOpenLogHarvest={() => {
              setPreselectedBatchId(undefined);
              setShowLogHarvestModal(true);
            }}
          />
        );
      case 'inventory':
        return <InventoryPage />;
      case 'orders':
        return (
          <OrdersPage
            onOpenNewOrder={() => setShowNewOrderModal(true)}
          />
        );
      case 'deliveries':
        return <DeliveriesPage />;
      case 'customers':
        return <CustomersPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'sales':
        return (
          <SalesPage
            onOpenQuickSale={() => setShowQuickSaleModal(true)}
          />
        );
      case 'payments':
        return <PaymentsPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'profitloss':
        return <ProfitLossPage />;
      case 'reports':
        return <ReportsPage />;
      case 'notifications':
        return <NotificationsPage onNavigate={setActiveTab} />;
      case 'settings':
        return <SettingsPage />;
      case 'backup':
        return <BackupPage />;
      case 'auth':
        return <AuthPage />;
      default:
        return (
          <DashboardPage
            onNavigate={setActiveTab}
            onOpenNewOrder={() => setShowNewOrderModal(true)}
            onOpenLogHarvest={() => {
              setPreselectedBatchId(undefined);
              setShowLogHarvestModal(true);
            }}
            onOpenQuickSale={() => setShowQuickSaleModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Top Fixed Header */}
      <Header
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenQuickSale={() => setShowQuickSaleModal(true)}
        onOpenNewOrder={() => setShowNewOrderModal(true)}
        onOpenLogHarvest={() => {
          setPreselectedBatchId(undefined);
          setShowLogHarvestModal(true);
        }}
        onOpenAddExpense={() => setShowAddExpenseModal(true)}
        onNavigate={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals */}
      <NewOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
      />

      <LogHarvestModal
        isOpen={showLogHarvestModal}
        preselectedBatchId={preselectedBatchId}
        onClose={() => {
          setShowLogHarvestModal(false);
          setPreselectedBatchId(undefined);
        }}
      />

      <NewBatchModal
        isOpen={showNewBatchModal}
        onClose={() => setShowNewBatchModal(false)}
      />

      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
      />

      <QuickSaleModal
        isOpen={showQuickSaleModal}
        onClose={() => setShowQuickSaleModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <AppContent />
    </FarmProvider>
  );
}
